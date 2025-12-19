'use client';

import { useState, useEffect } from 'react';
import { getWorkoutLogs, createWorkoutLog, deleteWorkoutLog } from './actions';
import { getPlans } from '../plans/actions';
import WorkoutEntryModal from './components/WorkoutEntryModal';

type Plan = {
  id: string;
  title: string;
  plan_json: any;
};

type WorkoutLog = {
  id: string;
  plan_id: string | null;
  workout_date: string;
  workout_data: any;
  notes: string | null;
  created_at: string;
};

export default function Logs() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsData, plansData] = await Promise.all([
          getWorkoutLogs(),
          getPlans(),
        ]);
        setWorkoutLogs(logsData);
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddWorkout = () => {
    setShowModal(true);
  };

  const handleSaveWorkout = async (workoutData: any, notes: string) => {
    try {
      const newLog = await createWorkoutLog(
        selectedPlan?.id || null,
        selectedDate,
        workoutData,
        notes
      );
      setWorkoutLogs([newLog, ...workoutLogs]);
      setShowModal(false);
      setSelectedPlan(null);
      setSelectedDate(new Date().toISOString().split('T')[0]); // Reset date
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    }
  };

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    setSelectedPlan(plan || null);
  };

  const handleDeleteWorkout = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this workout log?')) return;

    try {
      await deleteWorkoutLog(logId);
      setWorkoutLogs(workoutLogs.filter((log) => log.id !== logId));
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Failed to delete workout. Please try again.');
    }
  };

  const groupLogsByDate = () => {
    const grouped: { [date: string]: WorkoutLog[] } = {};
    workoutLogs.forEach((log) => {
      const date = log.workout_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });
    return grouped;
  };

  const groupedLogs = groupLogsByDate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            Loading workout logs...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Workout Log
          </h1>
          <button
            onClick={handleAddWorkout}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add Workout
          </button>
        </div>

        {/* Workout Logs */}
        {workoutLogs.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">
              No workout logs yet.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Click "Add Workout" to log your first workout.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedLogs)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((date) => (
                <div key={date}>
                  <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                  <div className="space-y-3">
                    {groupedLogs[date].map((log) => (
                      <div
                        key={log.id}
                        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                              {log.plan_id
                                ? plans.find((p) => p.id === log.plan_id)
                                    ?.title || 'Workout'
                                : 'Custom Workout'}
                              {log.workout_data?.planDay && (
                                <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                                  Day {log.workout_data.planDay}
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {log.workout_data?.exercises?.length || 0}{' '}
                              exercises
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteWorkout(log.id)}
                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                        {log.notes && (
                          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            {log.notes}
                          </p>
                        )}
                        {log.workout_data?.exercises && (
                          <div className="mt-3 space-y-2">
                            {log.workout_data.exercises.map(
                              (exercise: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="rounded bg-zinc-50 p-2 text-sm dark:bg-zinc-800"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                                      {exercise.name}
                                    </div>
                                    {exercise.target && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400">
                                        Target: {exercise.target}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                    {exercise.sets?.length || 0} sets completed
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {showModal && (
        <WorkoutEntryModal
          plans={plans}
          selectedPlan={selectedPlan}
          selectedDate={selectedDate}
          onPlanChange={handlePlanChange}
          onDateChange={setSelectedDate}
          onSave={handleSaveWorkout}
          onClose={() => {
            setShowModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
}
