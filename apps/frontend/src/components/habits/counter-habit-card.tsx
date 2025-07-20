import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Minus, MoreHorizontal, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import JSConfetti from "js-confetti";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { playSuccessSound } from "../../lib/sound";
import { Habit } from "@/api/generated";
import { ExtendedHabit } from "@/api/types/appTypes";

interface CounterHabitCardProps {
  habit: Habit | ExtendedHabit;
  dates: Date[];
  formatDate: (date: Date) => string;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>
  ) => void;
  onIncrement: (habitId: string, date: string) => Promise<void>;
  onDecrement: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  style?: React.CSSProperties;
  isHomePage?: boolean;
  showOptions?: boolean;
  glowEffect?: boolean;
}

export function CounterHabitCard({
  habit,
  dates,
  formatDate,
  localCompletionStatus,
  setLocalCompletionStatus,
  onIncrement,
  onDecrement,
  jsConfettiRef,
  style,
  isHomePage = false,
  showOptions = true,
  glowEffect = false,
}: CounterHabitCardProps) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const completionValue =
    localCompletionStatus[habit._id]?.[today] ??
    habit.completedDates[today] ??
    0;
  const isCompleted = completionValue >= habit.targetCounter;

  return (
    <Card
      className="transition-all"
      style={{
        ...style,
        backgroundColor: isCompleted ? `${habit.color}20` : undefined,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-8">
          <div className="min-w-[200px] text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold mb-1">{habit.name}</h2>
              {showOptions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate(`/stats/${habit._id}`)}
                    >
                      View stats
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="flex gap-6 flex-grow justify-end">
            {dates.map((date) => {
              const formattedDate = date.toISOString().split("T")[0];
              const completionValue =
                localCompletionStatus[habit._id]?.[formattedDate] ??
                habit.completedDates[formattedDate] ??
                0;
              const isCompleted = completionValue >= habit.targetCounter;

              return (
                <TooltipProvider key={date.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(date)}
                        </span>
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className="text-sm font-medium"
                            style={{ color: habit.color }}
                          >
                            {completionValue}/{habit.targetCounter}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className={cn(
                                "rounded-full w-6 h-6 p-0",
                                glowEffect && !isCompleted && "animate-glow"
                              )}
                              style={{
                                borderColor: habit.color,
                                ...(glowEffect &&
                                  !isCompleted &&
                                  ({
                                    "--habit-color": habit.color,
                                  } as React.CSSProperties)),
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newValue = Math.max(
                                  0,
                                  completionValue - 1
                                );

                                if (isHomePage) {
                                  setLocalCompletionStatus({
                                    [habit._id]: {
                                      [formattedDate]: newValue,
                                    },
                                  });
                                  return;
                                }

                                setLocalCompletionStatus((prev) => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: newValue,
                                  },
                                }));
                                onDecrement(habit._id, formattedDate).catch(
                                  () => {
                                    setLocalCompletionStatus((prev) => ({
                                      ...prev,
                                      [habit._id]: {
                                        ...prev[habit._id],
                                        [formattedDate]: completionValue,
                                      },
                                    }));
                                  }
                                );
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className={cn(
                                "rounded-full w-6 h-6 p-0",
                                glowEffect && !isCompleted && "animate-glow"
                              )}
                              style={{
                                backgroundColor: isCompleted
                                  ? habit.color
                                  : undefined,
                                borderColor: habit.color,
                                ...(glowEffect &&
                                  !isCompleted &&
                                  ({
                                    "--habit-color": habit.color,
                                  } as React.CSSProperties)),
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newValue = completionValue + 1;

                                if (isHomePage) {
                                  setLocalCompletionStatus({
                                    [habit._id]: {
                                      [formattedDate]: newValue,
                                    },
                                  });
                                  if (newValue == habit.targetCounter) {
                                    jsConfettiRef.current?.addConfetti({
                                      confettiColors: [habit.color],
                                      confettiNumber: 200,
                                    });
                                    playSuccessSound();
                                  }
                                  return;
                                }

                                setLocalCompletionStatus((prev) => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: newValue,
                                  },
                                }));
                                onIncrement(habit._id, formattedDate).catch(
                                  () => {
                                    setLocalCompletionStatus((prev) => ({
                                      ...prev,
                                      [habit._id]: {
                                        ...prev[habit._id],
                                        [formattedDate]: completionValue,
                                      },
                                    }));
                                  }
                                );
                                if (newValue >= habit.targetCounter) {
                                  jsConfettiRef.current?.addConfetti({
                                    confettiColors: [habit.color],
                                    confettiNumber: 200,
                                  });
                                  playSuccessSound();
                                }
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {`${completionValue}/${habit.targetCounter} completed`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
