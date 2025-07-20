import { Habit } from "@/api/generated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";

interface LongestStreakCardProps {
  readonly habit: Habit;
  readonly longestStreak: number;
}

export default function LongestStreakCard({
  habit,
  longestStreak,
}: LongestStreakCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader>
        <CardTitle className="text-center">Longest Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ color: habit.color }}>
          {longestStreak === 0 ? (
            <p className="text-4xl font-bold">0</p>
          ) : (
            <NumberTicker
              className="text-4xl font-bold"
              value={longestStreak}
            />
          )}
        </div>
        <p className="text-muted-foreground text-center mt-2">days</p>
      </CardContent>
    </Card>
  );
}
