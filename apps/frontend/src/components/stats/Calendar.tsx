import { Card, CardContent } from "@/components/ui/card";

import { useHabits } from "@/api/hooks/useHabits";
import { HabitType } from "@/api/types/appTypes";
import { isAfter, format } from "date-fns";
import { startOfDay } from "date-fns";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { Habit } from "@/api/generated";

interface CalendarProps {
  readonly habit: Habit;
}

export default function Calendar({ habit }: CalendarProps) {
  const { trackHabit, untrackHabit, refreshHabits } = useHabits();

  const [localCompletionStatus, setLocalCompletionStatus] = useState(
    habit.completedDates
  );

  // Update local state when habit changes
  useEffect(() => {
    setLocalCompletionStatus(habit.completedDates);
  }, [habit.completedDates]);

  const completedDates = Object.entries(localCompletionStatus)
    .filter(([, value]) => value > 0)
    .map(([date]) => new Date(date));

  const handleDayClick = async (day: Date) => {
    if (habit.type === HabitType.COUNTER) {
      return null;
    }

    if (isAfter(startOfDay(day), startOfDay(new Date()))) {
      return;
    }

    const formattedDate = format(day, "yyyy-MM-dd");
    const isCompleted = localCompletionStatus[formattedDate] > 0;

    // Optimistically update UI
    setLocalCompletionStatus((prev) => ({
      ...prev,
      [formattedDate]: isCompleted ? 0 : 1,
    }));

    try {
      if (isCompleted) {
        await untrackHabit(habit._id, formattedDate);
      } else {
        await trackHabit(habit._id, formattedDate);
      }
      // Refresh habits data to get the updated completedDates
      await refreshHabits();
    } catch {
      // Revert local state on error
      setLocalCompletionStatus((prev) => ({
        ...prev,
        [formattedDate]: isCompleted ? 1 : 0,
      }));
    }
  };

  return (
    <Card className="col-span-1 md:col-span-1">
      <CardContent className="flex justify-center items-center">
        <DayPicker
          mode="multiple"
          selected={completedDates}
          modifiers={{ completed: completedDates }}
          modifiersStyles={{
            completed: {
              backgroundColor: habit.color,
              color: "black",
              fontWeight: "500",
              transform: "scale(0.75)",
            },
          }}
          onDayClick={handleDayClick}
          disabled={[{ after: new Date() }]}
          className="mx-auto dark:rdp-day_selected:text-background"
        />
      </CardContent>
    </Card>
  );
}
