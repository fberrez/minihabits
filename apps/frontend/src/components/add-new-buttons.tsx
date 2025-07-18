import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface AddNewButtonsProps {
  showBothButtons?: boolean;
  className?: string;
  redirectToAuth?: boolean;
}

export function AddNewButtons({ redirectToAuth = false }: AddNewButtonsProps) {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(redirectToAuth ? "/auth" : path);
  };

  return (
    <Button
      className="border-dashed w-full max-w-4xl"
      onClick={() => handleClick("/new")}
    >
      <Plus className="h-5 w-5 mr-2" />
      Add new habit
    </Button>
  );
}
