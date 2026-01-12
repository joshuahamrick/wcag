export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export type IssueSeverity = 'LEGAL' | 'USABILITY' | 'BEST_PRACTICE';

export type BusinessType = 'government' | 'publicAccommodation' | 'education' | 'healthcare' | 'financial' | 'other';

export interface StateComplianceInfo {
  stateCode: string;
  stateName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedExposure: string;
  demandLetterLikelihood: 'low' | 'medium' | 'high';
  applicableLaws: {
    code: string;
    name: string;
    description: string;
    privateRightOfAction: boolean;
    penalties: string;
  }[];
  priorityRemediations: string[];
}

export interface PageSnapshot {
  url: string;
  html: string;
  screenshotBase64?: string;
}

export interface AutomatedFinding {
  id: string;
  wcagId?: string;
  impact?: string;
  description: string;
  help?: string;
  selector?: string;
  tags?: string[];
  snippet?: string;
}

export interface AIInterpretation {
  title: string;
  explanation: string;
  recommendation: string;
  risk: IssueSeverity;
  confidence: number;
  needsReview: boolean;
}

export interface IssueRecord {
  id: string;
  pageUrl: string;
  wcagId?: string;
  severity: IssueSeverity;
  confidence: number;
  needsReview: boolean;
  title: string;
  description: string;
  recommendation: string;
  selector?: string;
  snippet?: string;
  screenshotBase64?: string;
  screenshotKey?: string;
  htmlKey?: string;
}

export interface ScanResult {
  id: string;
  siteUrl: string;
  status: ScanStatus;
  issues: IssueRecord[];
  startedAt: Date;
  completedAt?: Date;
  pageCount: number;
  riskScore?: number;
  errorMessage?: string;
  // State-specific compliance
  stateCode?: string;
  businessType?: BusinessType;
  stateCompliance?: StateComplianceInfo;
}

export interface ScanRequest {
  url: string;
  maxPages?: number;
  stateCode?: string;
  businessType?: BusinessType;
}

