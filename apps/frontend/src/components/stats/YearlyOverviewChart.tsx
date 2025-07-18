import { Habit } from "@/api/generated";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface YearlyOverviewChartProps {
  readonly habit: Habit;
}

export default function YearlyOverviewChart({
  habit,
}: YearlyOverviewChartProps) {
  // Prepare data for the chart
  const getChartData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = months.map((month) => ({
      month,
      completions: 0,
    }));

    Object.keys(habit.completedDates).forEach((date) => {
      if (habit.completedDates[date]) {
        const monthIndex = new Date(date).getMonth();
        data[monthIndex].completions += 1;
      }
    });

    return data;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Overview</CardTitle>
        <CardDescription>
          Showing daily completions throughout the year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getChartData()}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="font-medium">
                            {payload[0].payload.month}
                          </span>
                          <span className="font-medium">
                            {payload[0].value} completions
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="completions"
                stroke={habit.color}
                fill={habit.color}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Showing completion rate for {new Date().getFullYear()}
        </div>
      </CardFooter>
    </Card>
  );
}
