import { useRef, useEffect, useState } from "react";
import { useHabits } from "../api/hooks/useHabits";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import JSConfetti from "js-confetti";
import { HabitType } from "../api/types/appTypes";
import { BooleanHabitCard } from "../components/habits/boolean-habit-card";
import { CounterHabitCard } from "../components/habits/counter-habit-card";
import { AddNewButtons } from "../components/add-new-buttons";
import { SubscriptionBadge } from "../components/SubscriptionBadge";
import { useSubscription } from "../hooks/useSubscription";

export function HabitList() {
  const {
    habits,
    isLoading,
    trackHabit: trackHabitApi,
    untrackHabit: untrackHabitApi,
    incrementHabit: incrementHabitApi,
    decrementHabit: decrementHabitApi,
    refreshHabits,
  } = useHabits();
  const { subscriptionInfo } = useSubscription();
  const navigate = useNavigate();
  const jsConfettiRef = useRef<JSConfetti | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [localCompletionStatus, setLocalCompletionStatus] = useState<
    Record<string, Record<string, number>>
  >({});

  // Create wrapper functions that return void
  const trackHabit = async (habitId: string, date: string): Promise<void> => {
    await trackHabitApi(habitId, date);
  };

  const untrackHabit = async (habitId: string, date: string): Promise<void> => {
    await untrackHabitApi(habitId, date);
  };

  const incrementHabit = async (
    habitId: string,
    date: string
  ): Promise<void> => {
    await incrementHabitApi(habitId, date);
  };

  const decrementHabit = async (
    habitId: string,
    date: string
  ): Promise<void> => {
    await decrementHabitApi(habitId, date);
  };

  useEffect(() => {
    jsConfettiRef.current = new JSConfetti();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch habits data when component mounts
    refreshHabits();
    // Using empty dependency array to run only once on mount
  }, []);

  const getLast5Days = () => {
    const dates = [];
    const maxDays = isMobile ? 1 : 5;
    for (let i = maxDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-8">
                  <div className="min-w-[200px]">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex gap-6">
                    {[...Array(isMobile ? 1 : 5)].map((_, j) => (
                      <div key={j} className="flex flex-col items-center gap-1">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header with subscription badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Your Habits</h1>
            {subscriptionInfo && (
              <SubscriptionBadge tier={subscriptionInfo.subscriptionTier} />
            )}
          </div>
          <div className="w-48">
            <AddNewButtons />
          </div>
        </div>
        <div className="space-y-4 habit-list">
          {/* Regular Habits Section */}
          {habits.map((habit) => {
            if (!localCompletionStatus[habit._id]) {
              setLocalCompletionStatus((prev) => ({
                ...prev,
                [habit._id]: { ...habit.completedDates },
              }));
            }

            const commonProps = {
              habit,
              localCompletionStatus,
              setLocalCompletionStatus,
              jsConfettiRef,
              onClick: () => navigate(`/stats/${habit._id}`),
            };

            switch (habit.type) {
              case HabitType.BOOLEAN:
                return (
                  <BooleanHabitCard
                    key={habit._id}
                    {...commonProps}
                    dates={getLast5Days()}
                    formatDate={formatDate}
                    onTrack={trackHabit}
                    onUntrack={untrackHabit}
                  />
                );
              case HabitType.COUNTER:
                return (
                  <CounterHabitCard
                    key={habit._id}
                    {...commonProps}
                    dates={getLast5Days()}
                    formatDate={formatDate}
                    onIncrement={incrementHabit}
                    onDecrement={decrementHabit}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </>
  );
}
