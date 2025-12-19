export type PlanDay = {
  dayNumber: number;
  title: string;
  exercises: PlanExercise[];
};

export type PlanExercise = {
  name: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number | null;
  notes?: string;
};

export function parsePlanDays(planJson: any): PlanDay[] {
  // Handle the text wrapper format
  const planText =
    typeof planJson === 'string'
      ? planJson
      : planJson?.content || JSON.stringify(planJson);

  const days: PlanDay[] = [];

  // Split by day headers (#### **Day X:...**)
  const dayRegex = /####\s*\*\*Day\s+(\d+):\s*([^*]+)\*\*/gi;
  const matches = [...planText.matchAll(dayRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const dayNumber = parseInt(match[1]);
    const title = match[2].trim();

    // Get the content between this day and the next day (or end of text)
    const startIndex = match.index! + match[0].length;
    const endIndex =
      i < matches.length - 1 ? matches[i + 1].index! : planText.length;
    const dayContent = planText.substring(startIndex, endIndex);

    // Parse exercises from this day's content
    const exercises = parseExercises(dayContent);

    days.push({
      dayNumber,
      title,
      exercises,
    });
  }

  return days;
}

function parseExercises(dayContent: string): PlanExercise[] {
  const exercises: PlanExercise[] = [];

  // Match exercise lines like:
  // - **Exercise Name**: 5x8-12
  // - **Exercise Name (notes)**: 3xAMRAP
  const exerciseRegex = /-\s*\*\*([^*:]+?)(?:\s*\([^)]+\))?\*\*:\s*(.+?)(?:\n|$)/gi;
  const matches = [...dayContent.matchAll(exerciseRegex)];

  for (const match of matches) {
    const name = match[1].trim();
    const setRepInfo = match[2].trim();

    // Parse sets and reps
    const parsed = parseSetReps(setRepInfo);
    if (parsed) {
      exercises.push({
        name,
        ...parsed,
      });
    }
  }

  return exercises;
}

function parseSetReps(setRepInfo: string): Omit<PlanExercise, 'name'> | null {
  // Handle formats like:
  // 5x8-12 -> 5 sets, 8-12 reps
  // 4x10-15 -> 4 sets, 10-15 reps
  // 3xAMRAP -> 3 sets, AMRAP
  // 3x12 -> 3 sets, 12 reps

  // AMRAP case
  if (/(\d+)xAMRAP/i.test(setRepInfo)) {
    const sets = parseInt(setRepInfo.match(/(\d+)/)![1]);
    return {
      targetSets: sets,
      targetRepsMin: 0,
      targetRepsMax: null,
      notes: 'AMRAP',
    };
  }

  // Standard format: XxY-Z or XxY
  const match = setRepInfo.match(/(\d+)x(\d+)(?:-(\d+))?/);
  if (match) {
    const sets = parseInt(match[1]);
    const repsMin = parseInt(match[2]);
    const repsMax = match[3] ? parseInt(match[3]) : null;

    return {
      targetSets: sets,
      targetRepsMin: repsMin,
      targetRepsMax: repsMax,
    };
  }

  return null;
}

export function formatTargetReps(exercise: PlanExercise): string {
  if (exercise.notes === 'AMRAP') {
    return 'AMRAP';
  }
  if (exercise.targetRepsMax) {
    return `${exercise.targetRepsMin}-${exercise.targetRepsMax}`;
  }
  return `${exercise.targetRepsMin}`;
}
