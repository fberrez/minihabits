import { useAuth } from "../providers/AuthProvider";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton({ onSelect }: { onSelect: () => void }) {
  const { signOut } = useAuth();

  const handleClick = () => {
    onSelect();
    signOut();
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="flex items-center"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
