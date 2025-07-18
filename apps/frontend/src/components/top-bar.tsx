import { Menu } from "lucide-react";
import { SiGithub, SiReddit } from "@icons-pack/react-simple-icons";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useAuth } from "@/providers/AuthProvider";
import { ModeToggle } from "./mode-toggle";
import { FeedbackButton } from "./feedback-button";
import { useState } from "react";
import { SignOutButton } from "./sign-out-button";
import { AccountSettingsButton } from "./account-settings-button";
import { Link } from "react-router-dom";

export function TopBar() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const menuItems = (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        {isAuthenticated && (
          <>
            <AccountSettingsButton onSelect={() => setOpen(false)} />
          </>
        )}
        <ModeToggle />
        {isAuthenticated && <FeedbackButton />}
        {isAuthenticated && <SignOutButton onSelect={() => setOpen(false)} />}
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold">
          <Link to="/">minihabits.</Link>
        </h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {menuItems}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() =>
                  window.open(
                    "https://github.com/fberrez/minihabits-web",
                    "_blank"
                  )
                }
              >
                <SiGithub size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() =>
                  window.open("https://reddit.com/r/minihabits", "_blank")
                }
              >
                <SiReddit size={20} />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
