export interface PeriodEntry {
  id: string;
  startDate: Date;
  endDate?: Date;
  flowIntensity?: FlowIntensity[];
  symptoms?: Symptom[];
  notes?: string;
}

export interface FlowIntensity {
  date: Date;
  intensity: 'light' | 'medium' | 'heavy' | 'spotting';
}

export interface Symptom {
  date: Date;
  type: SymptomType;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export type SymptomType =
  | 'cramps'
  | 'headache'
  | 'bloating'
  | 'mood_swings'
  | 'fatigue'
  | 'breast_tenderness'
  | 'acne'
  | 'backache'
  | 'nausea'
  | 'insomnia'
  | 'food_cravings'
  | 'other';

export interface CycleData {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStart?: Date;
  nextPredictedPeriod?: Date;
  fertileWindowStart?: Date;
  fertileWindowEnd?: Date;
  ovulationDay?: Date;
  currentDayOfCycle?: number;
}

export interface CycleInsights {
  totalCycles: number;
  averageCycleLength: number;
  averagePeriodLength: number;
  shortestCycle: number;
  longestCycle: number;
  cycleRegularity: 'regular' | 'irregular' | 'very_irregular';
  commonSymptoms: { symptom: SymptomType; frequency: number }[];
}

export interface DayInfo {
  date: Date;
  isPeriod: boolean;
  isToday: boolean;
  isPredicted: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  flowIntensity?: 'light' | 'medium' | 'heavy' | 'spotting';
  symptoms: Symptom[];
  dayOfCycle?: number;
}
