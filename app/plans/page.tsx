'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPlans, deletePlan } from './actions';

type Plan = {
  id: string;
  title: string;
  source_prompt: string;
  plan_json: any;
  created_at: string;
  is_active: boolean;
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await deletePlan(planId);
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    }
  };

  const handleViewPlan = (planId: string) => {
    router.push(`/plans/${planId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-zinc-600 dark:text-zinc-400">Loading plans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
          Your Training Plans
        </h1>

        {plans.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              You haven't saved any training plans yet.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Chat with your coach and use the "Save as Plan" button to save workout plans.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    {plan.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Created {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Original Request:
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {plan.source_prompt}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewPlan(plan.id)}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View Plan
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-red-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
