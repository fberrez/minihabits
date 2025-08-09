import { MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

export function FeedbackButton() {
  const handleClick = () => {
    window.location.href = `mailto:${
      import.meta.env.VITE_CONTACT_EMAIL
    }?subject=MiniHabits%20Feedback`;
  };

  return (
    <Button
      variant="outline"
      className="bg-yellow-400 text-black hover:bg-yellow-400/80"
      onClick={handleClick}
      title="Send feedback"
    >
      <MessageSquare className="mr-2 h-4 w-4" /> Send feedback
    </Button>
  );
}
