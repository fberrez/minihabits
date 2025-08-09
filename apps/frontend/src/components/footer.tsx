import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t py-4 mt-8">
      <div className="container mx-auto max-w-2xl flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms-of-use" className="hover:underline">
            Terms of Use
          </Link>
          <Link to="/pricing" className="hover:underline">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} minihabits</span>
          <span>·</span>
          <a
            href="https://github.com/fberrez/minihabits"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <span>·</span>
          <a
            href="https://reddit.com/r/minihabits"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Reddit
          </a>
        </div>
      </div>
    </footer>
  );
}
