import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { UserCog } from 'lucide-react';

export function AccountSettingsButton({ onSelect }: { onSelect: () => void }) {
  return (
    <Button variant="outline" asChild onClick={onSelect}>
      <Link to="/account" className="flex items-center">
        <UserCog className="mr-2 h-4 w-4" />
        Account Settings
      </Link>
    </Button>
  );
}
