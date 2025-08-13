import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

type FeedbackButtonProps = {
  compact?: boolean;
};

export function FeedbackButton({ compact = false }: FeedbackButtonProps) {
  const handleClick = () => {
    window.location.href = `mailto:${
      import.meta.env.VITE_CONTACT_EMAIL
    }?subject=MiniHabits%20Feedback`;
  };

  return (
    <Button
      variant="outline"
      className={
        compact
          ? 'group inline-flex items-center justify-start h-9 rounded-full glass-surface border px-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] w-9 md:hover:w-44'
          : 'bg-yellow-400 text-black hover:bg-yellow-400/80'
      }
      onClick={handleClick}
      title="Send feedback"
    >
      <MessageSquare
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
        {compact ? 'Send feedback' : ' Send feedback'}
      </span>
    </Button>
  );
}
