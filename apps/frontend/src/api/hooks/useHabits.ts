import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import {
  CreateHabitDto,
  UpdateHabitDto,
  HabitsService,
  OpenAPI,
  HabitStatsOutput,
  Habit,
} from "../generated";
import { HabitColor, HabitType } from "../types/appTypes";
import { useCallback } from "react";

export function useHabits() {
  const { accessToken, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Set the authorization token for the OpenAPI client
  if (accessToken) {
    OpenAPI.TOKEN = accessToken;
  }

  // Fetch all habits
  const {
    data: habits = [],
    isLoading,
    error,
    refetch: refreshHabits,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      if (!isAuthenticated || !accessToken) {
        return [];
      }

      return HabitsService.habitsControllerGetHabits();
    },
    enabled: isAuthenticated && !!accessToken,
  });

  // Get a single habit by ID
  const getHabitById = async (habitId: string): Promise<Habit> => {
    if (!isAuthenticated || !accessToken) {
      throw new Error("Not authenticated");
    }

    const habit = await HabitsService.habitsControllerGetHabit({
      id: habitId,
    });
    return habit;
  };

  // Get stats for a habit
  const getStats = useCallback(
    async (habitId: string): Promise<HabitStatsOutput> => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      const apiStats = await HabitsService.habitsControllerGetHabitStats({
        id: habitId,
      });
      return apiStats;
    },
    [isAuthenticated, accessToken]
  );

  // Create a new habit
  const createHabitMutation = useMutation({
    mutationFn: async (habitData: CreateHabitDto) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      const habit = await HabitsService.habitsControllerCreateHabit({
        requestBody: habitData,
      });
      return habit;
    },
    onSuccess: () => {
      // Invalidate the habits query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Update a habit
  const updateHabitMutation = useMutation({
    mutationFn: async ({
      habitId,
      data,
    }: {
      habitId: string;
      data: UpdateHabitDto;
    }) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      const habit = await HabitsService.habitsControllerUpdateHabit({
        id: habitId,
        requestBody: data,
      });
      return habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Delete a habit
  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      const habit = await HabitsService.habitsControllerDeleteHabit({
        id: habitId,
      });
      return habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Track a habit
  const trackHabitMutation = useMutation({
    mutationFn: async ({
      habitId,
      date,
    }: {
      habitId: string;
      date: string;
    }) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      const habit = await HabitsService.habitsControllerTrackHabit({
        id: habitId,
        requestBody: { date },
      });
      return habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Untrack a habit
  const untrackHabitMutation = useMutation({
    mutationFn: async ({
      habitId,
      date,
    }: {
      habitId: string;
      date: string;
    }) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error("Not authenticated");
      }

      const habit = await HabitsService.habitsControllerUntrackHabit({
        id: habitId,
        requestBody: { date },
      });
      return habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Wrapper functions to match the original context API
  const createHabit = async (
    name: string,
    color?: string,
    type: string = "boolean",
    targetCounter?: number
  ) => {
    // Validate color is a valid HabitColor
    const validColor = (color as HabitColor) || undefined;

    // Validate type is a valid HabitType
    const validType = (type as HabitType) || "boolean";

    const habitData: CreateHabitDto = {
      name,
      color: validColor,
      type: validType,
      targetCounter: validType === "counter" ? targetCounter : undefined,
    };

    const habit = await createHabitMutation.mutateAsync(habitData);
    return habit;
  };

  const updateHabit = async (
    habitId: string,
    data: {
      name?: string;
      color?: string;
      targetCounter?: number;
      type?: string;
    }
  ) => {
    // Only include properties that are in UpdateHabitDto
    const updateData: UpdateHabitDto = {
      name: data.name,
      color: data.color as HabitColor,
    };

    const habit = await updateHabitMutation.mutateAsync({
      habitId,
      data: updateData,
    });
    return habit;
  };

  const deleteHabit = async (habitId: string) => {
    const habit = await deleteHabitMutation.mutateAsync(habitId);
    return habit;
  };

  const trackHabit = async (habitId: string, date: string) => {
    const habit = await trackHabitMutation.mutateAsync({ habitId, date });
    return habit;
  };

  const untrackHabit = async (habitId: string, date: string) => {
    const habit = await untrackHabitMutation.mutateAsync({ habitId, date });
    return habit;
  };

  // Aliases for increment/decrement to match the original context API
  const incrementHabit = trackHabit;
  const decrementHabit = untrackHabit;

  return {
    habits,
    isLoading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    trackHabit,
    untrackHabit,
    incrementHabit,
    decrementHabit,
    refreshHabits,
    getStats,
    getHabitById,
    // Additional properties for more granular loading states
    isCreating: createHabitMutation.isPending,
    isUpdating: updateHabitMutation.isPending,
    isDeleting: deleteHabitMutation.isPending,
    isTracking: trackHabitMutation.isPending,
    isUntracking: untrackHabitMutation.isPending,
  };
}
