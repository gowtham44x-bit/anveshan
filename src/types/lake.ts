export interface LakeReadings {
  ph: number;
  do_mgl: number;
  tds: number;
  turbidity: number;
  temperature: number;
}

export type LakeStatus = 'Good' | 'Warning' | 'Critical';
export type PwdQualityClass = 'Desirable' | 'Acceptable' | 'Poor' | 'Unacceptable';
export type Region = 'North' | 'South' | 'West' | 'East' | 'Northeast' | 'Central';

export interface LakeItem {
  id: string;
  name: string;
  location: string;
  state?: string;
  region: Region;
  type: string;
  source: 'buoy' | 'pwd';
  lat: number;
  lng: number;
  status: LakeStatus;
  score: number;
  qualityClass?: PwdQualityClass;
  readings: LakeReadings;
  sampleId: string;
  date: string;
  causes: string[];
}

export interface RuleFlag {
  param: string;
  value: number;
  unit: string;
  level: string;
  msg: string;
}

export interface RecoveryActions {
  immediate: string[];
  short_term: string[];
  long_term: string[];
}

export interface AiAnalysis {
  status: string;
  summary: string;
  reasons: string[];
  likely_causes: string[];
  historical_comparison?: string;
  recovery_actions: RecoveryActions;
  notify: string[];
  source_notes: string[];
}

export interface DiagnosisResult {
  lake: string;
  location: string;
  lat: number | null;
  lng: number | null;
  sample_date: string;
  source: string;
  readings: LakeReadings;
  status: LakeStatus;
  score: number;
  rule_flags: RuleFlag[];
  ai_analysis: AiAnalysis;
  alert: boolean;
  generated_at: string;
}

export interface HardwareComponent {
  id: number;
  name: string;
  status: 'ONLINE' | 'HEALTHY' | 'LOCKED' | 'CALIBRATED' | 'ACTIVE' | 'HARVESTING' | 'CC CHARGING' | 'DIRT ALERT' | '88% S.O.C.';
  badgeColor: string;
  description: string;
  metrics: { [key: string]: string };
}
