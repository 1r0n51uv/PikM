// Tipi di dominio del modulo Palestra. Vedi docs/glossary.md per le definizioni.

export type ExerciseSource = "wger" | "ai" | "custom";

export interface Exercise {
  id: string;
  name: string;
  source: ExerciseSource;
  externalId?: string | null;
  muscleGroups: string[];
  equipment?: string | null;
  instructions?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export type RoutinePhase = "bulk" | "cut" | "deload" | "maintenance";

export interface Routine {
  id: string;
  userId: string;
  name: string;
  notes?: string | null;
  phase?: RoutinePhase | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineDay {
  id: string;
  routineId: string;
  name: string;
  orderIndex: number;
}

export interface RoutineExercise {
  id: string;
  routineDayId: string;
  exerciseId: string;
  orderIndex: number;
  supersetGroup?: string | null;
  targetSets: number;
  targetReps: string;
  targetRestSeconds: number;
}

export type WorkoutSessionSource = "app" | "watch";

export interface WorkoutSession {
  id: string;
  userId: string;
  routineDayId?: string | null;
  startedAt: string;
  endedAt?: string | null;
  notes?: string | null;
  source: WorkoutSessionSource;
}

export interface SetLog {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  setIndex: number;
  weightKg: number;
  reps: number;
  rpe?: number | null;
  supersetGroup?: string | null;
  completedAt: string;
  updatedAt: string;
}

/** Massimale stimato con formula di Epley: 1RM = peso * (1 + reps / 30) */
export function estimateOneRepMax(weightKg: number, reps: number): number {
  return weightKg * (1 + reps / 30);
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  recordedAt: string;
  weightKg?: number | null;
  /** Chiave libera, es. { armLeftCm: 38, waistCm: 82 } */
  measurements: Record<string, number>;
  photoUrls: string[];
  createdAt: string;
}

export interface PlateSetConfig {
  id: string;
  userId: string;
  barWeightKg: number;
  availablePlatesKg: number[];
}

/** Percentuali standard fisse del warm-up rispetto al peso di lavoro. */
export const WARMUP_RAMP_PERCENTAGES = [0.4, 0.6, 0.8] as const;

export type CoachingSuggestionStatus = "pending" | "accepted" | "rejected";

/** Proposta periodica di Claude su una routine, da confermare manualmente. */
export interface CoachingSuggestion {
  id: string;
  userId: string;
  routineId: string;
  generatedAt: string;
  summary: string;
  proposedChanges: Record<string, unknown>;
  status: CoachingSuggestionStatus;
  reviewedAt?: string | null;
}
