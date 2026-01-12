/**
 * State-specific accessibility requirements module
 *
 * This module provides jurisdiction-specific legal context for accessibility issues.
 * Each state may have additional laws beyond federal ADA/Section 508 requirements.
 *
 * IMPORTANT: This information is for educational purposes only and does not constitute legal advice.
 * Laws and penalties may have changed since last verification. Consult qualified legal counsel.
 */

// Last verification date for state law information
export const STATE_DATA_LAST_VERIFIED = '2025-01-11';
export const STATE_DATA_DISCLAIMER = 'State law information was last verified on January 11, 2025. Laws and penalties may have changed. This information is for educational purposes only and does not constitute legal advice. Consult qualified legal counsel for your specific situation.';

export interface StateRequirement {
  code: string;
  name: string;
  description: string;
  effectiveDate: string;
  appliesTo: ('government' | 'publicAccommodation' | 'education' | 'healthcare' | 'financial' | 'all')[];
  wcagLevel: 'A' | 'AA' | 'AAA';
  penalties: {
    firstViolation: string;
    subsequentViolation: string;
    statutoryDamages?: string;
    attorneyFees: boolean;
  };
  privateRightOfAction: boolean;
  demandLetterCommon: boolean;
  keyProvisions: string[];
  resources: string[];
}

export interface StateProfile {
  code: string;
  name: string;
  requirements: StateRequirement[];
  riskMultiplier: number; // 1.0 = baseline, higher = more litigation risk
  litigationTrend: 'increasing' | 'stable' | 'decreasing';
  notes: string;
}

export const STATE_PROFILES: Record<string, StateProfile> = {
  MD: {
    code: 'MD',
    name: 'Maryland',
    riskMultiplier: 1.2,
    litigationTrend: 'increasing',
    notes: 'Maryland has strong state-level accessibility requirements for government entities and has seen increasing ADA web accessibility litigation against private businesses.',
    requirements: [
      {
        code: 'MD-OISA',
        name: 'Maryland Online Information and Services Act',
        description: 'Requires state agencies to make websites and digital services accessible to individuals with disabilities, following WCAG 2.0 Level AA standards.',
        effectiveDate: '2020-07-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Corrective action required; potential budget impacts',
          subsequentViolation: 'Escalated oversight and mandatory accessibility audits',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'All new web content must meet WCAG 2.0 AA',
          'Existing content must be remediated on a priority basis',
          'Annual accessibility audits required',
          'Accessibility coordinator designation required',
          'User feedback mechanism must be provided'
        ],
        resources: [
          'https://doit.maryland.gov/policies/Pages/WebAccessibility.aspx'
        ]
      },
      {
        code: 'MD-HFAA',
        name: 'Maryland Human Relations Act (State ADA Equivalent)',
        description: 'Prohibits discrimination in places of public accommodation, which courts have increasingly interpreted to include websites.',
        effectiveDate: '1970-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Civil penalties up to $50,000',
          subsequentViolation: 'Civil penalties up to $100,000',
          statutoryDamages: 'Actual damages plus potential punitive damages',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Websites considered places of public accommodation',
          'Must provide equal access to goods and services',
          'Reasonable accommodations required',
          'Applies to businesses operating in Maryland'
        ],
        resources: [
          'https://mccr.maryland.gov/'
        ]
      }
    ]
  },
  CA: {
    code: 'CA',
    name: 'California',
    riskMultiplier: 2.0,
    litigationTrend: 'increasing',
    notes: 'California is the highest-risk state for web accessibility litigation due to the Unruh Civil Rights Act and active plaintiff bar.',
    requirements: [
      {
        code: 'CA-UNRUH',
        name: 'Unruh Civil Rights Act',
        description: 'Provides broad anti-discrimination protections. ADA violations are automatically Unruh violations, with minimum $4,000 statutory damages per violation.',
        effectiveDate: '1959-01-01',
        appliesTo: ['all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Minimum $4,000 per violation',
          subsequentViolation: '$4,000+ per violation (each page visit can be separate violation)',
          statutoryDamages: '$4,000 minimum per violation, uncapped',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'ADA violation = automatic Unruh violation',
          'No intent requirement',
          '$4,000 minimum statutory damages per violation',
          "Prevailing plaintiff entitled to attorney's fees",
          'Demand letters extremely common'
        ],
        resources: [
          'https://www.dfeh.ca.gov/unruhcivil/'
        ]
      },
      {
        code: 'CA-GOV',
        name: 'California Government Code Section 11135',
        description: 'Requires state-funded programs and websites to be accessible.',
        effectiveDate: '1977-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Loss of state funding eligibility',
          subsequentViolation: 'Continued ineligibility and potential litigation',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'All state-funded entities must ensure accessibility',
          'Includes contractors and grantees',
          'WCAG 2.0 AA is the standard'
        ],
        resources: [
          'https://www.dgs.ca.gov/Resources/Accessibility'
        ]
      }
    ]
  },
  NY: {
    code: 'NY',
    name: 'New York',
    riskMultiplier: 1.8,
    litigationTrend: 'increasing',
    notes: 'New York is a high-litigation state with active accessibility lawsuit filings, particularly in SDNY federal court.',
    requirements: [
      {
        code: 'NY-HRL',
        name: 'New York Human Rights Law',
        description: 'Prohibits discrimination in places of public accommodation. Interpreted to cover websites of businesses operating in NY.',
        effectiveDate: '1945-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory and punitive damages',
          subsequentViolation: 'Enhanced damages, injunctive relief',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Broad definition of public accommodation',
          'Applies to online services',
          "Plaintiff's attorney fees recoverable",
          'NYC has additional local requirements'
        ],
        resources: [
          'https://dhr.ny.gov/'
        ]
      },
      {
        code: 'NY-STD',
        name: 'New York State Technology Law',
        description: 'Requires state agency websites to meet accessibility standards.',
        effectiveDate: '2013-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation orders',
          subsequentViolation: 'Budget and oversight consequences',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'NYS-P08-005 policy compliance required',
          'WCAG 2.0 AA as minimum standard',
          'Regular accessibility testing mandated'
        ],
        resources: [
          'https://its.ny.gov/accessibility'
        ]
      }
    ]
  },
  FL: {
    code: 'FL',
    name: 'Florida',
    riskMultiplier: 1.5,
    litigationTrend: 'increasing',
    notes: 'Florida has seen significant increase in web accessibility lawsuits, particularly against e-commerce and hospitality businesses.',
    requirements: [
      {
        code: 'FL-CRA',
        name: 'Florida Civil Rights Act',
        description: 'Provides protections similar to federal ADA, interpreted to cover website accessibility.',
        effectiveDate: '1992-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Injunctive relief and actual damages',
          subsequentViolation: 'Enhanced damages',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Mirrors ADA Title III protections',
          'Covers places of public accommodation',
          "Attorney's fees available to prevailing plaintiffs"
        ],
        resources: [
          'https://www.fchr.state.fl.us/'
        ]
      }
    ]
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Texas relies primarily on federal ADA for website accessibility. State requirements focus on government entities.',
    requirements: [
      {
        code: 'TX-GOV',
        name: 'Texas Administrative Code Title 1, Part 10, Chapter 206',
        description: 'Requires state agency websites to be accessible according to WCAG standards.',
        effectiveDate: '2016-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Corrective action plans required',
          subsequentViolation: 'Agency oversight escalation',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA compliance required for state agencies',
          'DIR oversight and monitoring',
          'Annual accessibility assessments'
        ],
        resources: [
          'https://dir.texas.gov/resource-library-item/website-accessibility'
        ]
      }
    ]
  },
  IL: {
    code: 'IL',
    name: 'Illinois',
    riskMultiplier: 1.3,
    litigationTrend: 'increasing',
    notes: 'Illinois has the BIPA (Biometric Information Privacy Act) and IADA (Illinois Accessibility Development Act) adding compliance complexity.',
    requirements: [
      {
        code: 'IL-IADA',
        name: 'Illinois Information Technology Accessibility Act',
        description: 'Requires state agencies to ensure IT accessibility for employees and the public.',
        effectiveDate: '2007-07-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'Potential procurement restrictions',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA for state IT',
          'Procurement accessibility requirements',
          'Accessibility training mandated'
        ],
        resources: [
          'https://www.illinois.gov/accessibility'
        ]
      },
      {
        code: 'IL-HRA',
        name: 'Illinois Human Rights Act',
        description: 'Prohibits discrimination in public accommodations, increasingly applied to websites.',
        effectiveDate: '1979-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages and civil penalties',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Public accommodations must be accessible',
          'Applies to businesses serving Illinois residents',
          'Individual right to file complaints'
        ],
        resources: [
          'https://www2.illinois.gov/dhr/'
        ]
      }
    ]
  }
};

// WCAG criteria that commonly trigger state law violations
export const HIGH_RISK_WCAG_CRITERIA = [
  {
    id: '1.1.1',
    name: 'Non-text Content',
    stateRisk: 'high',
    reason: 'Missing alt text is the most common accessibility lawsuit trigger'
  },
  {
    id: '1.4.3',
    name: 'Contrast (Minimum)',
    stateRisk: 'high',
    reason: 'Color contrast failures affect large user populations'
  },
  {
    id: '2.1.1',
    name: 'Keyboard',
    stateRisk: 'critical',
    reason: 'Keyboard inaccessibility completely blocks access for many users'
  },
  {
    id: '2.4.4',
    name: 'Link Purpose',
    stateRisk: 'medium',
    reason: 'Unclear links create navigation barriers'
  },
  {
    id: '4.1.2',
    name: 'Name, Role, Value',
    stateRisk: 'critical',
    reason: 'Screen reader incompatibility is a primary litigation driver'
  },
  {
    id: '1.3.1',
    name: 'Info and Relationships',
    stateRisk: 'high',
    reason: 'Form labeling issues are common lawsuit triggers'
  }
];

export interface StateRiskAssessment {
  state: StateProfile;
  applicableRequirements: StateRequirement[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedExposure: string;
  priorityRemediations: string[];
  demandLetterLikelihood: 'low' | 'medium' | 'high';
}

export function assessStateRisk(
  stateCode: string,
  businessType: 'government' | 'publicAccommodation' | 'education' | 'healthcare' | 'financial' | 'other',
  issueCount: number,
  criticalIssueCount: number
): StateRiskAssessment | null {
  const state = STATE_PROFILES[stateCode.toUpperCase()];
  if (!state) return null;

  // Find applicable requirements
  const applicableRequirements = state.requirements.filter(req =>
    req.appliesTo.includes('all') || req.appliesTo.includes(businessType as any)
  );

  // Calculate risk level
  const baseRisk = criticalIssueCount > 0 ? 2 : issueCount > 10 ? 1 : 0;
  const adjustedRisk = baseRisk * state.riskMultiplier;

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (adjustedRisk >= 3) riskLevel = 'critical';
  else if (adjustedRisk >= 2) riskLevel = 'high';
  else if (adjustedRisk >= 1) riskLevel = 'medium';
  else riskLevel = 'low';

  // Calculate exposure
  const hasStatutoryDamages = applicableRequirements.some(r => r.penalties.statutoryDamages);
  const hasPrivateRightOfAction = applicableRequirements.some(r => r.privateRightOfAction);

  let estimatedExposure: string;
  if (stateCode === 'CA') {
    estimatedExposure = `$${(criticalIssueCount * 4000).toLocaleString()} - $${((criticalIssueCount + issueCount) * 4000).toLocaleString()} (Unruh statutory damages)`;
  } else if (hasStatutoryDamages && hasPrivateRightOfAction) {
    estimatedExposure = '$10,000 - $100,000+ (statutory damages plus attorney fees)';
  } else if (hasPrivateRightOfAction) {
    estimatedExposure = '$5,000 - $50,000 (litigation defense costs)';
  } else {
    estimatedExposure = 'Limited (primarily remediation costs)';
  }

  // Demand letter likelihood
  let demandLetterLikelihood: 'low' | 'medium' | 'high';
  if (state.riskMultiplier >= 1.8 && criticalIssueCount > 0) {
    demandLetterLikelihood = 'high';
  } else if (state.riskMultiplier >= 1.3 && issueCount > 5) {
    demandLetterLikelihood = 'medium';
  } else {
    demandLetterLikelihood = 'low';
  }

  // Priority remediations
  const priorityRemediations = [
    'Fix all critical accessibility issues immediately',
    'Add alt text to all images',
    'Ensure keyboard navigation works for all interactive elements',
    'Add proper form labels and ARIA attributes',
    'Fix color contrast issues'
  ];

  if (businessType === 'government') {
    priorityRemediations.push('Designate an accessibility coordinator');
    priorityRemediations.push('Implement user feedback mechanism');
  }

  return {
    state,
    applicableRequirements,
    riskLevel,
    estimatedExposure,
    priorityRemediations,
    demandLetterLikelihood
  };
}

export function getStateProfile(stateCode: string): StateProfile | undefined {
  return STATE_PROFILES[stateCode.toUpperCase()];
}

export function getAllStates(): StateProfile[] {
  return Object.values(STATE_PROFILES);
}

export function getHighRiskStates(): StateProfile[] {
  return Object.values(STATE_PROFILES).filter(s => s.riskMultiplier >= 1.5);
}
