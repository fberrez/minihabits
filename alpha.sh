#!/bin/bash

# Script to remove alpha channel from PNG files
# Usage: ./remove_alpha.sh [directory_path]
# If no directory specified, uses current directory

# Set directory - use argument if provided, otherwise current directory
DIR="${1:-.}"

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed."
    echo "Install it with: brew install imagemagick"
    exit 1
fi

# Use 'magick' if available (ImageMagick 7), otherwise 'convert' (ImageMagick 6)
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
else
    CONVERT_CMD="convert"
fi

# Check if directory exists
if [ ! -d "$DIR" ]; then
    echo "Error: Directory '$DIR' does not exist."
    exit 1
fi

# Find and process PNG files
png_files=($(find "$DIR" -maxdepth 1 -name "*.png" -type f))

if [ ${#png_files[@]} -eq 0 ]; then
    echo "No PNG files found in '$DIR'"
    exit 0
fi

echo "Found ${#png_files[@]} PNG file(s) in '$DIR'"
echo "Removing alpha channel..."

processed=0
skipped=0

for file in "${png_files[@]}"; do
    filename=$(basename "$file")
    echo -n "Processing $filename... "
    
    # Create backup with .bak extension
    cp "$file" "${file}.bak"
    
    # Remove alpha channel - flatten against white background
    if $CONVERT_CMD "$file" -background white -alpha remove -alpha off "${file}.tmp"; then
        mv "${file}.tmp" "$file"
        echo "✓ Done"
        ((processed++))
    else
        echo "✗ Failed"
        rm -f "${file}.tmp"
        # Restore from backup if conversion failed
        mv "${file}.bak" "$file"
        ((skipped++))
    fi
done

echo ""
echo "Summary:"
echo "- Processed: $processed files"
echo "- Skipped: $skipped files"
echo "- Backups created with .bak extension"

if [ $processed -gt 0 ]; then
    echo ""
    echo "To remove backup files, run: rm \"$DIR\"/*.png.bak"
fi