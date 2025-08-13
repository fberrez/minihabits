import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { UserCog } from 'lucide-react';

export function AccountSettingsButton({
  onSelect,
  compact = false,
}: {
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <Button
      variant="outline"
      asChild
      onClick={onSelect}
      className={
        compact
          ? 'group inline-flex items-center justify-start h-9 rounded-full glass-surface border px-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] w-9 md:hover:w-44'
          : ''
      }
    >
      <Link to="/account" className="flex items-center">
        <UserCog
          className={
            compact
              ? 'h-4 w-4 shrink-0 text-foreground/80 md:group-hover:text-foreground transition-colors'
              : 'mr-2 h-4 w-4'
          }
        />
        <span
          className={
            compact
              ? 'ml-2 whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block'
              : ''
          }
        >
          Account Settings
        </span>
      </Link>
    </Button>
  );
}
