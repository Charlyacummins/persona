'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPlanById, deletePlan } from '../actions';

type Plan = {
  id: string;
  title: string;
  source_prompt: string;
  plan_json: any;
  created_at: string;
  is_active: boolean;
};

export default function PlanDetail() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getPlanById(planId);
        if (data) {
          setPlan(data);
        } else {
          router.push('/plans');
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
        router.push('/plans');
      } finally {
        setIsLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    }
  }, [planId, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await deletePlan(planId);
      router.push('/plans');
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    }
  };

  const renderPlanContent = () => {
    if (!plan) return null;

    // If plan_json has a "content" property (plain text wrapper)
    if (plan.plan_json?.content && plan.plan_json?.format === 'text') {
      return (
        <div className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
          {plan.plan_json.content}
        </div>
      );
    }

    // If it's actual JSON, try to render it nicely
    if (typeof plan.plan_json === 'object') {
      return (
        <div className="space-y-4">
          <pre className="whitespace-pre-wrap rounded-lg bg-zinc-100 p-4 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {JSON.stringify(plan.plan_json, null, 2)}
          </pre>
        </div>
      );
    }

    // Fallback to string
    return (
      <div className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
        {String(plan.plan_json)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center text-zinc-600 dark:text-zinc-400">Loading plan...</div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/plans')}
            className="mb-4 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Plans
          </button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {plan.title}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Created {new Date(plan.created_at).toLocaleDateString()} at{' '}
                {new Date(plan.created_at).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="self-start rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-red-800 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              Delete Plan
            </button>
          </div>
        </div>

        {/* Original Request */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Original Request
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">{plan.source_prompt}</p>
        </div>

        {/* Plan Content */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Training Plan
          </h2>
          {renderPlanContent()}
        </div>
      </div>
    </div>
  );
}
