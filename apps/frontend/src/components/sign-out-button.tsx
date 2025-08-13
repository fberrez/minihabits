import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton({
  onSelect,
  compact = false,
}: {
  onSelect: () => void;
  compact?: boolean;
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect();
    signOut();
    navigate('/');
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={
        compact
          ? 'group inline-flex items-center justify-start h-9 rounded-full glass-surface border px-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] w-9 md:hover:w-36'
          : 'flex items-center'
      }
      title="Sign out"
    >
      <LogOut
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
        Sign out
      </span>
    </Button>
  );
}
