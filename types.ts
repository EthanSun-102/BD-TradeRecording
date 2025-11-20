export enum InteractionType {
  MEETING = 'MEETING',
  EMAIL = 'EMAIL',
  WECHAT = 'WECHAT',
  CALL = 'CALL'
}

export enum DealStage {
  LEAD = 'LEAD',
  DISCOVERY = 'DISCOVERY',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST'
}

export interface AiReflection {
  critical_score: number; // 1-10
  mistakes: string[];
  immediate_action: string;
}

export interface Interaction {
  id: string;
  dealId: string;
  date: string;
  type: InteractionType;
  content: string;
  summary?: string;
  aiFeedback?: AiReflection; // Changed from string to structured object
  createdAt: number;
}

export interface TurningPointPrediction {
  win_probability: number; // 0-100
  turning_point_date: string; // YYYY-MM-DD
  reasoning: string;
  risk_factors: string[];
}

export interface Deal {
  id: string;
  clientName: string;
  contactPerson: string;
  value: number;
  stage: DealStage;
  startDate: string;
  lastActivity: string;
  prediction?: TurningPointPrediction;
}

export interface DashboardStats {
  totalPipeline: number;
  winRate: number;
  criticalDeals: number;
}