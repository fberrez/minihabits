import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useTheme } from './theme-provider';

type ModeToggleProps = {
  compact?: boolean;
};

export function ModeToggle({ compact = false }: ModeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={
            compact
              ? 'group inline-flex items-center justify-start h-9 rounded-full glass-surface border px-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)] w-9 md:hover:w-32'
              : ''
          }
        >
          <div className={`relative w-4 h-4 ${compact ? '' : 'mr-2'}`}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground/80 md:group-hover:text-foreground" />
            <Moon className="absolute top-0 left-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground/80 md:group-hover:text-foreground" />
          </div>
          <span
            className={
              compact
                ? 'ml-2 whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block'
                : ''
            }
          >
            Theme
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
