import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Check, MoreHorizontal } from "lucide-react";
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

interface BooleanHabitCardProps {
  habit: Habit | ExtendedHabit;
  dates: Date[];
  formatDate: (date: Date) => string;
  localCompletionStatus: Record<string, Record<string, number>>;
  setLocalCompletionStatus: (
    value: React.SetStateAction<Record<string, Record<string, number>>>
  ) => void;
  onTrack: (habitId: string, date: string) => Promise<void>;
  onUntrack: (habitId: string, date: string) => Promise<void>;
  jsConfettiRef: React.RefObject<JSConfetti>;
  style?: React.CSSProperties;
  isHomePage?: boolean;
  showOptions?: boolean;
  glowEffect?: boolean;
}

export function BooleanHabitCard({
  habit,
  dates,
  formatDate,
  localCompletionStatus,
  setLocalCompletionStatus,
  onTrack,
  onUntrack,
  jsConfettiRef,
  style,
  isHomePage = false,
  showOptions = true,
  glowEffect = false,
}: BooleanHabitCardProps) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const isCompleted = localCompletionStatus[habit._id]?.[today] > 0;

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
              const isCompleted =
                (localCompletionStatus[habit._id]?.[formattedDate] ??
                  habit.completedDates[formattedDate] ??
                  0) > 0;

              return (
                <TooltipProvider key={date.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(date)}
                        </span>
                        <Button
                          size="icon"
                          variant={isCompleted ? "default" : "outline"}
                          className={cn(
                            "rounded-full w-8 h-8 p-0",
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
                            // If the habit is on the home page, we don't need to track or untrack it
                            if (isHomePage) {
                              setLocalCompletionStatus({
                                [habit._id]: {
                                  [formattedDate]: isCompleted ? 0 : 1,
                                },
                              });
                              if (!isCompleted) {
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
                                [formattedDate]: isCompleted ? 0 : 1,
                              },
                            }));

                            if (isCompleted) {
                              onUntrack(habit._id, formattedDate).catch(() => {
                                setLocalCompletionStatus((prev) => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: 1,
                                  },
                                }));
                              });
                            } else {
                              onTrack(habit._id, formattedDate).catch(() => {
                                setLocalCompletionStatus((prev) => ({
                                  ...prev,
                                  [habit._id]: {
                                    ...prev[habit._id],
                                    [formattedDate]: 0,
                                  },
                                }));
                              });
                              jsConfettiRef.current?.addConfetti({
                                confettiColors: [habit.color],
                                confettiNumber: 200,
                              });
                              playSuccessSound();
                            }
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isCompleted ? "Completed" : "Not completed"}
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
