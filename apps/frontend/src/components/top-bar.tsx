import { SiGithub, SiReddit } from '@icons-pack/react-simple-icons';
import { Button } from './ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { ModeToggle } from './mode-toggle';
import { FeedbackButton } from './feedback-button';
import { SignOutButton } from './sign-out-button';
import { AccountSettingsButton } from './account-settings-button';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function TopBar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isOnUseCase = location.pathname.startsWith('/use-cases');
  const showUseCases = isHome || isOnUseCase;
import { Menu } from 'lucide-react';
import { SiGithub, SiReddit } from '@icons-pack/react-simple-icons';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { useAuth } from '@/providers/AuthProvider';
import { ModeToggle } from './mode-toggle';
import { FeedbackButton } from './feedback-button';
import { useState } from 'react';
import { SignOutButton } from './sign-out-button';
import { AccountSettingsButton } from './account-settings-button';
import { Link } from 'react-router-dom';
import { useBilling } from '@/api/hooks/useBilling';
import { SubscriptionBadge } from './subscription-badge';

export function TopBar() {
  const { isAuthenticated } = useAuth();
  const { status } = useBilling();
  const [open, setOpen] = useState(false);

  const menuItems = (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link to="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
        </Button>
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur glass-surface supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-14 px-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-normal tracking-tight">
          <Link to={isAuthenticated ? '/habits' : '/'}>🌱 minihabits.</Link>
        </h1>

        <nav className="flex items-center gap-2">
          {showUseCases && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Use Cases</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/use-cases/student">Students</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/use-cases/productivity-entrepreneur">
                    Productivity & Entrepreneurs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/use-cases/gym">Gym & Movement</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/use-cases/parent">Parents</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/use-cases/mindfulness">Mindfulness</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isAuthenticated && (
            <Button variant="outline" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          )}

          {isAuthenticated && (
            <>
              <AccountSettingsButton compact onSelect={() => {}} />
              <FeedbackButton compact />
              <SignOutButton compact onSelect={() => {}} />
            </>
          )}

          <ModeToggle compact />

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() =>
              window.open('https://github.com/fberrez/minihabits-web', '_blank')
            }
          >
            <SiGithub size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() =>
              window.open('https://reddit.com/r/minihabits', '_blank')
            }
          >
            <SiReddit size={18} />
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">
            <Link to="/">minihabits.</Link>
          </h1>
          {isAuthenticated && <SubscriptionBadge planCode={status?.planCode} />}
        </div>
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
                    'https://github.com/fberrez/minihabits-web',
                    '_blank',
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
                  window.open('https://reddit.com/r/minihabits', '_blank')
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
