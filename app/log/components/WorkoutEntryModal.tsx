'use client';

import { useState, useEffect } from 'react';
import { parsePlanDays, formatTargetReps, type PlanDay, type PlanExercise } from '../utils/planParser';

type Plan = {
  id: string;
  title: string;
  plan_json: any;
};

type Exercise = {
  name: string;
  target?: string; // e.g., "5x8-12" or "3xAMRAP"
  sets: Set[];
};

type Set = {
  reps: number;
  weight: number;
  completed: boolean;
};

type WorkoutEntryModalProps = {
  plans: Plan[];
  selectedPlan: Plan | null;
  selectedDate: string;
  onPlanChange: (planId: string) => void;
  onDateChange: (date: string) => void;
  onSave: (workoutData: any, notes: string) => Promise<void>;
  onClose: () => void;
};

export default function WorkoutEntryModal({
  plans,
  selectedPlan,
  selectedDate,
  onPlanChange,
  onDateChange,
  onSave,
  onClose,
}: WorkoutEntryModalProps) {
  const [planDays, setPlanDays] = useState<PlanDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: [{ reps: 0, weight: 0, completed: false }] },
  ]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Parse plan days when plan is selected
  useEffect(() => {
    if (selectedPlan) {
      const days = parsePlanDays(selectedPlan.plan_json);
      setPlanDays(days);

      // Auto-select first day if available
      if (days.length > 0 && selectedDay === null) {
        setSelectedDay(days[0].dayNumber);
        loadDayExercises(days[0]);
      }
    } else {
      setPlanDays([]);
      setSelectedDay(null);
    }
  }, [selectedPlan]);

  const loadDayExercises = (day: PlanDay) => {
    const loadedExercises: Exercise[] = day.exercises.map((ex: PlanExercise) => {
      const targetStr = `${ex.targetSets}x${formatTargetReps(ex)}`;

      // Create empty sets based on target
      const sets: Set[] = Array.from({ length: ex.targetSets }, () => ({
        reps: ex.targetRepsMin,
        weight: 0,
        completed: false,
      }));

      return {
        name: ex.name,
        target: targetStr,
        sets,
      };
    });

    setExercises(loadedExercises.length > 0 ? loadedExercises : [
      { name: '', sets: [{ reps: 0, weight: 0, completed: false }] },
    ]);
  };

  const handleDayChange = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    const day = planDays.find((d) => d.dayNumber === dayNumber);
    if (day) {
      loadDayExercises(day);
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', sets: [{ reps: 0, weight: 0, completed: false }] },
    ]);
  };

  const removeExercise = (exerciseIndex: number) => {
    setExercises(exercises.filter((_, idx) => idx !== exerciseIndex));
  };

  const updateExerciseName = (exerciseIndex: number, name: string) => {
    const updated = [...exercises];
    updated[exerciseIndex].name = name;
    setExercises(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...exercises];
    const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    updated[exerciseIndex].sets.push({
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      completed: false,
    });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter(
      (_, idx) => idx !== setIndex
    );
    setExercises(updated);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof Set,
    value: number | boolean
  ) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setExercises(updated);
  };

  const handleSave = async () => {
    // Validate that all exercises have names
    const hasEmptyNames = exercises.some((ex) => !ex.name.trim());
    if (hasEmptyNames) {
      alert('Please enter a name for all exercises');
      return;
    }

    setIsSaving(true);
    try {
      const workoutData = {
        planDay: selectedDay,
        exercises: exercises.map((ex) => ({
          name: ex.name,
          target: ex.target,
          sets: ex.sets,
        })),
      };
      await onSave(workoutData, notes);
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl dark:bg-zinc-800">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Log Workout
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Plan and Date Selection */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select Plan (Optional)
              </label>
              <select
                value={selectedPlan?.id || ''}
                onChange={(e) => onPlanChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">No plan (custom workout)</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Workout Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
          </div>

          {/* Day Selector */}
          {selectedPlan && planDays.length > 0 && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Select Training Day
              </label>
              <div className="flex flex-wrap gap-2">
                {planDays.map((day) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => handleDayChange(day.dayNumber)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      selectedDay === day.dayNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                    }`}
                  >
                    Day {day.dayNumber}
                    <span className="ml-1 text-xs opacity-75">
                      {day.title.length > 15
                        ? day.title.substring(0, 15) + '...'
                        : day.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {exercises.map((exercise, exerciseIndex) => (
              <div
                key={exerciseIndex}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        updateExerciseName(exerciseIndex, e.target.value)
                      }
                      placeholder="Exercise name"
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                    {exercise.target && (
                      <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                        Target: {exercise.target}
                      </p>
                    )}
                  </div>
                  {exercises.length > 1 && (
                    <button
                      onClick={() => removeExercise(exerciseIndex)}
                      className="ml-3 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <div className="col-span-1">Set</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-4">Weight (lbs)</div>
                    <div className="col-span-2">Done</div>
                    <div className="col-span-1"></div>
                  </div>

                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-12 gap-2">
                      <div className="col-span-1 flex items-center text-sm text-zinc-700 dark:text-zinc-300">
                        {setIndex + 1}
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) =>
                            updateSet(
                              exerciseIndex,
                              setIndex,
                              'reps',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                          min="0"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) =>
                            updateSet(
                              exerciseIndex,
                              setIndex,
                              'weight',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          step="0.5"
                          className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                          min="0"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={set.completed}
                          onChange={(e) =>
                            updateSet(
                              exerciseIndex,
                              setIndex,
                              'completed',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        {exercise.sets.length > 1 && (
                          <button
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addSet(exerciseIndex)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  + Add Set
                </button>
              </div>
            ))}

            <button
              onClick={addExercise}
              className="w-full rounded-lg border-2 border-dashed border-zinc-300 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-300"
            >
              + Add Exercise
            </button>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Workout Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="How did the workout feel? Any observations?"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
