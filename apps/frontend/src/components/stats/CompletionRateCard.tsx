import { Habit } from "@/api/generated";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";

interface CompletionRateCardProps {
  readonly habit: Habit;
  readonly completionRate: number;
  readonly title: string;
  readonly description: string;
}

export default function CompletionRateCard({
  habit,
  completionRate,
  title,
  description,
}: CompletionRateCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ color: habit.color }}>
          {completionRate === 0 ? (
            <p className="text-4xl font-bold">0</p>
          ) : (
            <NumberTicker
              className="text-4xl font-bold"
              value={Math.round(completionRate)}
            />
          )}
        </div>
        <p className="text-muted-foreground text-center mt-2">%</p>
      </CardContent>
    </Card>
  );
}
