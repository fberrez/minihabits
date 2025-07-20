import { HabitType } from "@/api/types/appTypes";
import { HabitStatsOutput } from "@/api/generated";
import "cal-heatmap/cal-heatmap.css";
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { useHabits } from "../api/hooks/useHabits";
import "./StatsPage.css";
import { useToast } from "../hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calendar,
  Heatmap,
  CurrentStreakCard,
  LongestStreakCard,
  CompletionRateCard,
  YearlyOverviewChart,
  MonthlyOverviewChart,
} from "@/components/stats";

export function StatsPage() {
  const { habitId } = useParams();
  const { habits, deleteHabit, refreshHabits, getStats } = useHabits();
  const navigate = useNavigate();

  const habit = habits.find((h) => h._id === habitId);
  const [isEditing, setIsEditing] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitStats, setHabitStats] = useState<HabitStatsOutput | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const { toast } = useToast();
  const updateHabit = useHabits().updateHabit;

  useEffect(() => {
    // Fetch habits data when component mounts
    refreshHabits();
    // Using empty dependency array to run only once on mount
  }, []);

  useEffect(() => {
    // Fetch stats for the specific habit when habitId changes
    const fetchHabitStats = async () => {
      if (habitId) {
        try {
          setIsLoadingStats(true);
          const stats = await getStats(habitId);
          setHabitStats(stats);
        } catch {
          toast({
            title: "Error",
            description: "Failed to fetch habit statistics",
            variant: "destructive",
          });
        } finally {
          setIsLoadingStats(false);
        }
      }
    };

    fetchHabitStats();
    // getStats is now memoized with useCallback in the useHabits hook, so it's safe to include in the dependency array
  }, [habitId, getStats, toast]);

  const handleEditClick = async () => {
    setIsEditing(!isEditing);

    if (isEditing) {
      try {
        updateHabit(habit!._id, { name: habitTitle });
        toast({
          title: "Habit Modified",
          description: "New habit title saved successfully",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to update habit title",
          variant: "destructive",
        });
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHabitTitle(e.target.value);
  };

  useEffect(() => {
    if (habit) {
      setHabitTitle(habit.name);
    }
  }, [habit, habit?._id]);

  if (!habit) return null;

  if (isLoadingStats) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (habit?.type !== HabitType.COUNTER && habit?.type !== HabitType.BOOLEAN) {
    return (
      <div className="flex justify-center items-center py-8 mx-auto max-w-5xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            This habit is not a counter or boolean.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Use stats from the API if available, otherwise fall back to the habit object
  const currentStreak = habitStats?.currentStreak ?? habit.currentStreak ?? 0;
  const longestStreak = habitStats?.longestStreak ?? habit.longestStreak ?? 0;
  const completionRate7Days = habitStats?.completionRate7Days ?? 0;
  const completionRateMonth = habitStats?.completionRateMonth ?? 0;
  const completionRateYear = habitStats?.completionRateYear ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: habit.color }}
          />
          {isEditing ? (
            <input
              type="text"
              value={habitTitle}
              onChange={handleTitleChange}
              onBlur={handleEditClick}
              autoFocus
              spellCheck="true"
              className="text-3xl font-bold ring-1 ring-blue-600 rounded-lg px-2 py-0.5"
            />
          ) : (
            <h1
              className="text-3xl font-bold px-2 py-0.5 cursor-pointer hover:bg-gray-50 transition-all rounded-lg"
              onClick={handleEditClick}
            >
              {habitTitle}
            </h1>
          )}
        </div>
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{habit.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await deleteHabit(habit._id);
                    navigate("/");
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="md:block grid grid-cols-1 gap-8">
        <Heatmap habit={habit} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Calendar habit={habit} />
        <CurrentStreakCard habit={habit} currentStreak={currentStreak} />
        <LongestStreakCard habit={habit} longestStreak={longestStreak} />

        <CompletionRateCard
          habit={habit}
          completionRate={completionRate7Days}
          title="Completion Rate"
          description="Last 7 days"
        />

        <CompletionRateCard
          habit={habit}
          completionRate={completionRateMonth}
          title="Monthly Rate"
          description="This month (completed days only)"
        />

        <CompletionRateCard
          habit={habit}
          completionRate={completionRateYear}
          title="Yearly Rate"
          description="This year (completed days only)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <YearlyOverviewChart habit={habit} />
        <MonthlyOverviewChart habit={habit} />
      </div>
    </div>
  );
}
