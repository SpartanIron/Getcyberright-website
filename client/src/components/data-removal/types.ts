export interface WalkthroughStep {
  stepNumber: number;
  title: string;
  description: string;
  actionType: "navigate" | "click" | "fill_form" | "verify" | "wait" | "confirm";
  url?: string;
}

export interface WalkthroughData {
  brokerId: string;
  brokerName: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  requiresCaptcha: boolean;
  requiresAccount: boolean;
  requiresId: boolean;
  requiresPhone: boolean;
  optOutUrl: string;
  steps: WalkthroughStep[];
  tips: string[];
}

export interface DataBroker {
  id: string;
  name: string;
  domain: string;
  description: string | null;
  category: string;
  dataTypesCollected: string[] | null;
  optOutMethod: string;
  optOutUrl: string | null;
  optOutEmail: string | null;
  optOutInstructions: string | null;
  difficulty: string;
  estimatedProcessingDays: number | null;
  requiresIdVerification: boolean | null;
  requiresAccountCreation: boolean | null;
  legalBasis: string[] | null;
  countriesApplicable: string[] | null;
  riskLevel: string | null;
  monthlyVisitors: string | null;
  parentCompany: string | null;
  isActive: boolean | null;
}

export interface VaultProfile {
  id: string;
  fullName: string;
  profileName?: string | null;
  previousNames: string[] | null;
  emails: string[] | null;
  phoneNumbers: string[] | null;
  currentAddress: string | null;
  previousAddresses: string[] | null;
  dateOfBirth: string | null;
  relativeNames: string[] | null;
  employerNames: string[] | null;
  privacyMode?: string | null;
  priorityLevel?: string | null;
  complianceFrameworks?: string[] | null;
}

export interface ScanResult {
  id: string;
  vaultProfileId: string;
  status: string;
  totalExposures: number | null;
  totalBrokersScanned: number | null;
  completedAt: string | null;
  createdAt: string;
}

export interface ScanFinding {
  id: string;
  scanId: string;
  brokerId: string;
  broker: DataBroker;
  dataTypesFound: string[] | null;
  dataTypesExposed: string[] | null;
  riskLevel: string | null;
  exposureLevel: string | null;
  exposureDetails: string | null;
  verificationMethod: string | null;
  verificationDetails: string | null;
  sourceEvidence: string | null;
}

export interface RemovalRequest {
  id: string;
  brokerId: string;
  broker?: DataBroker;
  brokerName?: string;
  brokerDomain?: string;
  status: string;
  optOutContent: string | null;
  notes: string | null;
  jurisdictionApplied: string | null;
  legalBasisUsed: string | null;
  complianceDeadline: string | null;
  retryCount: number | null;
  escalationLevel: number | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalExposures: number;
  inProgress: number;
  completed: number;
  failed: number;
  reAppeared: number;
  pending: number;
  successRate: number;
  avgProcessingDays: number;
  retryable: number;
  overdue: number;
  escalated: number;
  jurisdictionBreakdown: Record<string, number>;
  totalScans: number;
}

export interface SmartQueueItem {
  broker: DataBroker;
  finding: any;
  priorityScore: number;
  priorityReason: string;
  estimatedSuccessRate: number;
  recommendedMethod: string;
}
