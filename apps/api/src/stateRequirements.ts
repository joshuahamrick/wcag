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
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    riskMultiplier: 1.2,
    litigationTrend: 'increasing',
    notes: 'Pennsylvania has seen growing web accessibility litigation, particularly in Philadelphia federal courts.',
    requirements: [
      {
        code: 'PA-PHRA',
        name: 'Pennsylvania Human Relations Act',
        description: 'Prohibits discrimination in public accommodations, interpreted to include websites.',
        effectiveDate: '1955-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced damages and injunctive relief',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Broad public accommodation definition',
          'Applies to online businesses serving PA residents',
          'Attorney fees recoverable'
        ],
        resources: [
          'https://www.phrc.pa.gov/'
        ]
      }
    ]
  },
  NJ: {
    code: 'NJ',
    name: 'New Jersey',
    riskMultiplier: 1.4,
    litigationTrend: 'increasing',
    notes: 'New Jersey Law Against Discrimination provides strong protections and has active accessibility litigation.',
    requirements: [
      {
        code: 'NJ-LAD',
        name: 'New Jersey Law Against Discrimination',
        description: 'Comprehensive civil rights law prohibiting discrimination in places of public accommodation.',
        effectiveDate: '1945-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory and punitive damages',
          subsequentViolation: 'Treble damages in some cases',
          statutoryDamages: 'Potential treble damages',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'One of strongest state civil rights laws',
          'Websites covered as public accommodations',
          'Punitive damages available',
          'No caps on damages'
        ],
        resources: [
          'https://www.nj.gov/oag/dcr/'
        ]
      }
    ]
  },
  MA: {
    code: 'MA',
    name: 'Massachusetts',
    riskMultiplier: 1.3,
    litigationTrend: 'stable',
    notes: 'Massachusetts has strong disability rights protections under Chapter 272 and Chapter 151B.',
    requirements: [
      {
        code: 'MA-PPA',
        name: 'Massachusetts Public Accommodations Law (Ch. 272 §98)',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1865-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Fine up to $2,500 and/or imprisonment',
          subsequentViolation: 'Enhanced criminal penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Criminal penalties possible',
          'Civil remedies available',
          'Covers online services'
        ],
        resources: [
          'https://www.mass.gov/orgs/massachusetts-commission-against-discrimination'
        ]
      }
    ]
  },
  GA: {
    code: 'GA',
    name: 'Georgia',
    riskMultiplier: 1.1,
    litigationTrend: 'increasing',
    notes: 'Georgia has moderate web accessibility litigation activity, primarily relying on federal ADA.',
    requirements: [
      {
        code: 'GA-GOV',
        name: 'Georgia Technology Authority Accessibility Standards',
        description: 'Requires state websites to meet accessibility standards.',
        effectiveDate: '2012-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'Budget oversight',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA compliance for state IT',
          'Mandatory accessibility testing',
          'Centralized oversight'
        ],
        resources: [
          'https://gta.georgia.gov/'
        ]
      }
    ]
  },
  OH: {
    code: 'OH',
    name: 'Ohio',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Ohio primarily relies on federal ADA with state government accessibility requirements.',
    requirements: [
      {
        code: 'OH-GOV',
        name: 'Ohio IT Standard ITS-ACC-01',
        description: 'Establishes web accessibility standards for Ohio state agencies.',
        effectiveDate: '2015-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Corrective action required',
          subsequentViolation: 'Escalated oversight',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA mandatory for state sites',
          'Annual accessibility assessments',
          'DAS oversight'
        ],
        resources: [
          'https://das.ohio.gov/'
        ]
      }
    ]
  },
  MI: {
    code: 'MI',
    name: 'Michigan',
    riskMultiplier: 1.1,
    litigationTrend: 'stable',
    notes: 'Michigan has the Elliott-Larsen Civil Rights Act providing disability protections.',
    requirements: [
      {
        code: 'MI-ELCRA',
        name: 'Elliott-Larsen Civil Rights Act',
        description: 'Prohibits discrimination in public accommodations and services.',
        effectiveDate: '1976-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Civil damages',
          subsequentViolation: 'Enhanced damages',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Covers places of public accommodation',
          'Individual lawsuit rights',
          'Civil remedies available'
        ],
        resources: [
          'https://www.michigan.gov/mdcr/'
        ]
      }
    ]
  },
  WA: {
    code: 'WA',
    name: 'Washington',
    riskMultiplier: 1.2,
    litigationTrend: 'increasing',
    notes: 'Washington has strong disability rights protections and active technology sector.',
    requirements: [
      {
        code: 'WA-LAD',
        name: 'Washington Law Against Discrimination',
        description: 'Comprehensive civil rights law covering public accommodations.',
        effectiveDate: '1949-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Actual damages plus up to $10,000',
          subsequentViolation: 'Enhanced damages',
          statutoryDamages: 'Up to $10,000 plus actual damages',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Statutory damages up to $10,000',
          'Covers online services',
          'Strong enforcement'
        ],
        resources: [
          'https://www.hum.wa.gov/'
        ]
      },
      {
        code: 'WA-GOV',
        name: 'Washington State Policy #188',
        description: 'Requires state websites to meet WCAG accessibility standards.',
        effectiveDate: '2016-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'Budget impacts',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.1 AA standard',
          'Accessibility coordinators required',
          'Regular audits'
        ],
        resources: [
          'https://ocio.wa.gov/policy/accessibility'
        ]
      }
    ]
  },
  AZ: {
    code: 'AZ',
    name: 'Arizona',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Arizona has state government accessibility requirements but limited private sector litigation.',
    requirements: [
      {
        code: 'AZ-GOV',
        name: 'Arizona Statewide Policy P8100',
        description: 'Mandates accessibility for state agency websites and applications.',
        effectiveDate: '2017-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'Agency accountability measures',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA compliance',
          'Accessibility statements required',
          'ADOA oversight'
        ],
        resources: [
          'https://azdoa.gov/'
        ]
      }
    ]
  },
  CO: {
    code: 'CO',
    name: 'Colorado',
    riskMultiplier: 1.3,
    litigationTrend: 'increasing',
    notes: 'Colorado recently enacted HB21-1110 with comprehensive accessibility requirements.',
    requirements: [
      {
        code: 'CO-HB21',
        name: 'Colorado HB21-1110 (Accessibility for Individuals with Disabilities)',
        description: 'Requires state and local government websites to meet WCAG 2.1 AA standards.',
        effectiveDate: '2024-07-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation timeline required',
          subsequentViolation: 'Oversight escalation',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.1 AA standard (newer than most states)',
          'Applies to state and local government',
          'Implementation timeline through 2024'
        ],
        resources: [
          'https://leg.colorado.gov/'
        ]
      },
      {
        code: 'CO-CADA',
        name: 'Colorado Anti-Discrimination Act',
        description: 'Prohibits disability discrimination in public accommodations.',
        effectiveDate: '1957-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Civil penalties and damages',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Covers places of public accommodation',
          'Individual complaint rights',
          'Civil Rights Division enforcement'
        ],
        resources: [
          'https://ccrd.colorado.gov/'
        ]
      }
    ]
  },
  VA: {
    code: 'VA',
    name: 'Virginia',
    riskMultiplier: 1.1,
    litigationTrend: 'stable',
    notes: 'Virginia has state IT accessibility requirements and general disability protections.',
    requirements: [
      {
        code: 'VA-GOV',
        name: 'Virginia ITRM Standard SEC502-02',
        description: 'Establishes accessibility standards for Virginia state agency IT.',
        effectiveDate: '2013-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Corrective action required',
          subsequentViolation: 'VITA oversight',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA compliance',
          'VITA oversight',
          'Procurement accessibility requirements'
        ],
        resources: [
          'https://www.vita.virginia.gov/'
        ]
      }
    ]
  },
  NC: {
    code: 'NC',
    name: 'North Carolina',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'North Carolina has state IT accessibility requirements through SCIO.',
    requirements: [
      {
        code: 'NC-GOV',
        name: 'North Carolina Statewide IT Accessibility',
        description: 'Requires state agencies to meet accessibility standards.',
        effectiveDate: '2014-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'DIT oversight',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA standard',
          'DIT/SCIO oversight',
          'Accessibility testing requirements'
        ],
        resources: [
          'https://it.nc.gov/'
        ]
      }
    ]
  },
  MN: {
    code: 'MN',
    name: 'Minnesota',
    riskMultiplier: 1.2,
    litigationTrend: 'stable',
    notes: 'Minnesota Human Rights Act provides strong disability protections.',
    requirements: [
      {
        code: 'MN-HRA',
        name: 'Minnesota Human Rights Act',
        description: 'Prohibits discrimination in public accommodations and services.',
        effectiveDate: '1967-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced damages and civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Broad disability protections',
          'Covers public accommodations',
          'Strong enforcement'
        ],
        resources: [
          'https://mn.gov/mdhr/'
        ]
      }
    ]
  },
  CT: {
    code: 'CT',
    name: 'Connecticut',
    riskMultiplier: 1.3,
    litigationTrend: 'increasing',
    notes: 'Connecticut has proactive accessibility legislation and strong civil rights protections.',
    requirements: [
      {
        code: 'CT-PA',
        name: 'Connecticut Public Act 17-99',
        description: 'Requires state agency websites to conform to WCAG 2.0 Level AA.',
        effectiveDate: '2017-10-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'Oversight escalation',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'WCAG 2.0 AA mandatory',
          'Annual accessibility audits',
          'Accessibility coordinator required'
        ],
        resources: [
          'https://portal.ct.gov/DAS/CTEdTech/Commission-for-Educational-Technology'
        ]
      }
    ]
  },
  AL: {
    code: 'AL',
    name: 'Alabama',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Alabama follows federal ADA standards with limited state-specific requirements.',
    requirements: [
      {
        code: 'AL-ADA',
        name: 'Alabama ADA Compliance',
        description: 'Follows federal ADA Title III requirements for public accommodations.',
        effectiveDate: '1992-01-26',
        appliesTo: ['publicAccommodation', 'government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Federal remedies apply',
          subsequentViolation: 'Injunctive relief and damages',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Federal ADA compliance required',
          'State agencies must be accessible'
        ],
        resources: [
          'https://www.ada.gov/'
        ]
      }
    ]
  },
  AK: {
    code: 'AK',
    name: 'Alaska',
    riskMultiplier: 0.8,
    litigationTrend: 'stable',
    notes: 'Alaska has minimal state-specific web accessibility requirements beyond federal ADA.',
    requirements: [
      {
        code: 'AK-HRC',
        name: 'Alaska Human Rights Law',
        description: 'Prohibits discrimination in public accommodations including digital services.',
        effectiveDate: '1965-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Cease and desist order',
          subsequentViolation: 'Civil penalties',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Reasonable accommodations required'
        ],
        resources: [
          'https://humanrights.alaska.gov/'
        ]
      }
    ]
  },
  AR: {
    code: 'AR',
    name: 'Arkansas',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Arkansas requires state agency websites to meet accessibility standards.',
    requirements: [
      {
        code: 'AR-DFA',
        name: 'Arkansas IT Accessibility',
        description: 'State agencies must ensure IT accessibility for people with disabilities.',
        effectiveDate: '2010-01-01',
        appliesTo: ['government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Remediation required',
          subsequentViolation: 'Administrative action',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'State IT accessibility policy',
          'WCAG compliance for government sites'
        ],
        resources: [
          'https://www.dfa.arkansas.gov/'
        ]
      }
    ]
  },
  DE: {
    code: 'DE',
    name: 'Delaware',
    riskMultiplier: 1.1,
    litigationTrend: 'increasing',
    notes: 'Delaware has strong civil rights protections and corporation-friendly courts attract litigation.',
    requirements: [
      {
        code: 'DE-DDA',
        name: 'Delaware Discrimination Act',
        description: 'Comprehensive civil rights law covering disability discrimination.',
        effectiveDate: '1986-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Covers places of public accommodation',
          'Attorneys fees available'
        ],
        resources: [
          'https://dhr.delaware.gov/'
        ]
      }
    ]
  },
  HI: {
    code: 'HI',
    name: 'Hawaii',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Hawaii has progressive disability rights laws with moderate enforcement.',
    requirements: [
      {
        code: 'HI-DCRA',
        name: 'Hawaii Civil Rights Act',
        description: 'Prohibits discrimination based on disability in public accommodations.',
        effectiveDate: '1989-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Civil penalties up to $10,000',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Broad disability protections',
          'Public accommodation access required'
        ],
        resources: [
          'https://labor.hawaii.gov/hcrc/'
        ]
      }
    ]
  },
  ID: {
    code: 'ID',
    name: 'Idaho',
    riskMultiplier: 0.8,
    litigationTrend: 'stable',
    notes: 'Idaho has limited state-specific accessibility requirements.',
    requirements: [
      {
        code: 'ID-HRA',
        name: 'Idaho Human Rights Act',
        description: 'Prohibits discrimination including on basis of disability.',
        effectiveDate: '1969-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Cease and desist',
          subsequentViolation: 'Civil penalties',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Commission enforcement'
        ],
        resources: [
          'https://humanrights.idaho.gov/'
        ]
      }
    ]
  },
  IN: {
    code: 'IN',
    name: 'Indiana',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Indiana follows federal standards with state civil rights protections.',
    requirements: [
      {
        code: 'IN-CRL',
        name: 'Indiana Civil Rights Law',
        description: 'Prohibits discrimination in public accommodations based on disability.',
        effectiveDate: '1971-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation accessibility',
          'Disability discrimination prohibited'
        ],
        resources: [
          'https://www.in.gov/icrc/'
        ]
      }
    ]
  },
  IA: {
    code: 'IA',
    name: 'Iowa',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Iowa has civil rights protections with moderate enforcement activity.',
    requirements: [
      {
        code: 'IA-CRA',
        name: 'Iowa Civil Rights Act',
        description: 'Comprehensive civil rights law covering disability discrimination.',
        effectiveDate: '1965-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Broad civil rights protections',
          'Administrative enforcement available'
        ],
        resources: [
          'https://icrc.iowa.gov/'
        ]
      }
    ]
  },
  KS: {
    code: 'KS',
    name: 'Kansas',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Kansas has state accessibility requirements for government entities.',
    requirements: [
      {
        code: 'KS-KADA',
        name: 'Kansas Acts Against Discrimination',
        description: 'Prohibits discrimination in public accommodations based on disability.',
        effectiveDate: '1961-01-01',
        appliesTo: ['publicAccommodation', 'all', 'government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Cease and desist',
          subsequentViolation: 'Civil penalties up to $10,000',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Commission enforcement'
        ],
        resources: [
          'https://www.khrc.net/'
        ]
      }
    ]
  },
  KY: {
    code: 'KY',
    name: 'Kentucky',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Kentucky has civil rights protections aligned with federal ADA.',
    requirements: [
      {
        code: 'KY-CRA',
        name: 'Kentucky Civil Rights Act',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1966-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation access required',
          'Administrative and judicial remedies'
        ],
        resources: [
          'https://kchr.ky.gov/'
        ]
      }
    ]
  },
  LA: {
    code: 'LA',
    name: 'Louisiana',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Louisiana has disability rights laws with moderate enforcement.',
    requirements: [
      {
        code: 'LA-RSHAD',
        name: 'Louisiana Rights of Persons with Disabilities',
        description: 'Protects rights of individuals with disabilities in public accommodations.',
        effectiveDate: '1984-01-01',
        appliesTo: ['publicAccommodation'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Actual damages',
          subsequentViolation: 'Treble damages possible',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Right to full participation',
          'Discrimination prohibited'
        ],
        resources: [
          'https://gov.louisiana.gov/page/disability-affairs'
        ]
      }
    ]
  },
  ME: {
    code: 'ME',
    name: 'Maine',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Maine has strong human rights protections including disability discrimination.',
    requirements: [
      {
        code: 'ME-HRA',
        name: 'Maine Human Rights Act',
        description: 'Comprehensive civil rights law prohibiting disability discrimination.',
        effectiveDate: '1972-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Broad disability protections',
          'Public accommodation access required'
        ],
        resources: [
          'https://www.maine.gov/mhrc/'
        ]
      }
    ]
  },
  MS: {
    code: 'MS',
    name: 'Mississippi',
    riskMultiplier: 0.8,
    litigationTrend: 'stable',
    notes: 'Mississippi has limited state-specific accessibility enforcement.',
    requirements: [
      {
        code: 'MS-ADA',
        name: 'Mississippi ADA Compliance',
        description: 'Follows federal ADA requirements for public accommodations.',
        effectiveDate: '1992-01-26',
        appliesTo: ['publicAccommodation', 'government'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Federal remedies',
          subsequentViolation: 'Injunctive relief',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Federal ADA compliance',
          'State agency accessibility'
        ],
        resources: [
          'https://www.ada.gov/'
        ]
      }
    ]
  },
  MO: {
    code: 'MO',
    name: 'Missouri',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Missouri has human rights protections covering disability discrimination.',
    requirements: [
      {
        code: 'MO-HRA',
        name: 'Missouri Human Rights Act',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1986-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Actual damages',
          subsequentViolation: 'Punitive damages possible',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Administrative complaint process'
        ],
        resources: [
          'https://labor.mo.gov/mohumanrights'
        ]
      }
    ]
  },
  MT: {
    code: 'MT',
    name: 'Montana',
    riskMultiplier: 0.8,
    litigationTrend: 'stable',
    notes: 'Montana has human rights protections with limited accessibility litigation.',
    requirements: [
      {
        code: 'MT-HRA',
        name: 'Montana Human Rights Act',
        description: 'Prohibits discrimination based on disability in public accommodations.',
        effectiveDate: '1974-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability protections',
          'Commission enforcement'
        ],
        resources: [
          'https://erd.dli.mt.gov/human-rights'
        ]
      }
    ]
  },
  NE: {
    code: 'NE',
    name: 'Nebraska',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Nebraska has civil rights protections including disability discrimination.',
    requirements: [
      {
        code: 'NE-FEPA',
        name: 'Nebraska Fair Employment Practice Act',
        description: 'Prohibits discrimination in public accommodations.',
        effectiveDate: '1965-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Cease and desist',
          subsequentViolation: 'Civil penalties',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation access',
          'Commission enforcement'
        ],
        resources: [
          'https://neoc.nebraska.gov/'
        ]
      }
    ]
  },
  NV: {
    code: 'NV',
    name: 'Nevada',
    riskMultiplier: 1.1,
    litigationTrend: 'increasing',
    notes: 'Nevada has strong consumer protection laws and tourism industry scrutiny.',
    requirements: [
      {
        code: 'NV-ERD',
        name: 'Nevada Equal Rights',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1965-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Punitive damages possible',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Full and equal access required',
          'Strong tourism industry focus'
        ],
        resources: [
          'https://detr.nv.gov/Page/Nevada_Equal_Rights_Commission'
        ]
      }
    ]
  },
  NH: {
    code: 'NH',
    name: 'New Hampshire',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'New Hampshire has comprehensive human rights protections.',
    requirements: [
      {
        code: 'NH-LAD',
        name: 'New Hampshire Law Against Discrimination',
        description: 'Prohibits discrimination in public accommodations based on disability.',
        effectiveDate: '1992-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Commission and court enforcement'
        ],
        resources: [
          'https://www.nh.gov/hrc/'
        ]
      }
    ]
  },
  NM: {
    code: 'NM',
    name: 'New Mexico',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'New Mexico has human rights protections covering disability discrimination.',
    requirements: [
      {
        code: 'NM-HRA',
        name: 'New Mexico Human Rights Act',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1969-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced remedies',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Broad disability protections',
          'Administrative enforcement'
        ],
        resources: [
          'https://www.dws.state.nm.us/Human-Rights'
        ]
      }
    ]
  },
  ND: {
    code: 'ND',
    name: 'North Dakota',
    riskMultiplier: 0.8,
    litigationTrend: 'stable',
    notes: 'North Dakota has limited accessibility litigation activity.',
    requirements: [
      {
        code: 'ND-HRA',
        name: 'North Dakota Human Rights Act',
        description: 'Prohibits discrimination based on disability.',
        effectiveDate: '1983-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Department of Labor enforcement'
        ],
        resources: [
          'https://www.nd.gov/labor/human-rights'
        ]
      }
    ]
  },
  OK: {
    code: 'OK',
    name: 'Oklahoma',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Oklahoma has disability rights protections with moderate enforcement.',
    requirements: [
      {
        code: 'OK-OADA',
        name: 'Oklahoma Anti-Discrimination Act',
        description: 'Prohibits discrimination in public accommodations.',
        effectiveDate: '1968-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Actual damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation accessibility',
          'Commission enforcement'
        ],
        resources: [
          'https://www.ok.gov/ohrc/'
        ]
      }
    ]
  },
  OR: {
    code: 'OR',
    name: 'Oregon',
    riskMultiplier: 1.2,
    litigationTrend: 'increasing',
    notes: 'Oregon has progressive disability rights laws and active enforcement.',
    requirements: [
      {
        code: 'OR-ORS659A',
        name: 'Oregon Civil Rights Laws',
        description: 'Comprehensive civil rights protections including disability discrimination.',
        effectiveDate: '1973-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages up to $200,000',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: true,
        keyProvisions: [
          'Broad civil rights protections',
          'Strong administrative enforcement',
          'Substantial damage awards'
        ],
        resources: [
          'https://www.oregon.gov/boli/civil-rights/'
        ]
      }
    ]
  },
  RI: {
    code: 'RI',
    name: 'Rhode Island',
    riskMultiplier: 1.1,
    litigationTrend: 'stable',
    notes: 'Rhode Island has comprehensive civil rights protections.',
    requirements: [
      {
        code: 'RI-FEPA',
        name: 'Rhode Island Fair Employment Practices Act',
        description: 'Prohibits discrimination in public accommodations.',
        effectiveDate: '1949-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Disability discrimination prohibited',
          'Commission enforcement'
        ],
        resources: [
          'https://richr.ri.gov/'
        ]
      }
    ]
  },
  SC: {
    code: 'SC',
    name: 'South Carolina',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'South Carolina has human affairs law covering disability discrimination.',
    requirements: [
      {
        code: 'SC-HAL',
        name: 'South Carolina Human Affairs Law',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1972-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation access',
          'Commission enforcement'
        ],
        resources: [
          'https://schac.sc.gov/'
        ]
      }
    ]
  },
  SD: {
    code: 'SD',
    name: 'South Dakota',
    riskMultiplier: 0.8,
    litigationTrend: 'stable',
    notes: 'South Dakota has limited state-specific accessibility requirements.',
    requirements: [
      {
        code: 'SD-HRA',
        name: 'South Dakota Human Relations Act',
        description: 'Prohibits discrimination in public accommodations.',
        effectiveDate: '1972-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Cease and desist',
          subsequentViolation: 'Civil penalties',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Discrimination prohibited',
          'Commission enforcement'
        ],
        resources: [
          'https://dlr.sd.gov/human_rights/'
        ]
      }
    ]
  },
  TN: {
    code: 'TN',
    name: 'Tennessee',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Tennessee has disability rights protections with moderate enforcement.',
    requirements: [
      {
        code: 'TN-HRA',
        name: 'Tennessee Human Rights Act',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1978-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation access required',
          'Commission and court remedies'
        ],
        resources: [
          'https://www.tn.gov/humanrights.html'
        ]
      }
    ]
  },
  UT: {
    code: 'UT',
    name: 'Utah',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'Utah has antidiscrimination laws covering disability.',
    requirements: [
      {
        code: 'UT-AAA',
        name: 'Utah Antidiscrimination Act',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1965-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: false
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation accessibility',
          'Division enforcement'
        ],
        resources: [
          'https://laborcommission.utah.gov/divisions/antidiscrimination-and-labor-uald/'
        ]
      }
    ]
  },
  VT: {
    code: 'VT',
    name: 'Vermont',
    riskMultiplier: 1.0,
    litigationTrend: 'stable',
    notes: 'Vermont has progressive civil rights protections.',
    requirements: [
      {
        code: 'VT-FEPA',
        name: 'Vermont Fair Employment Practices Act',
        description: 'Prohibits discrimination in public accommodations based on disability.',
        effectiveDate: '1963-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Enhanced penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Broad disability protections',
          'Commission enforcement'
        ],
        resources: [
          'https://hrc.vermont.gov/'
        ]
      }
    ]
  },
  WV: {
    code: 'WV',
    name: 'West Virginia',
    riskMultiplier: 0.9,
    litigationTrend: 'stable',
    notes: 'West Virginia has human rights protections covering disability.',
    requirements: [
      {
        code: 'WV-HRA',
        name: 'West Virginia Human Rights Act',
        description: 'Prohibits discrimination in places of public accommodation.',
        effectiveDate: '1967-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Public accommodation access',
          'Commission enforcement'
        ],
        resources: [
          'https://hrc.wv.gov/'
        ]
      }
    ]
  },
  WI: {
    code: 'WI',
    name: 'Wisconsin',
    riskMultiplier: 1.1,
    litigationTrend: 'stable',
    notes: 'Wisconsin has comprehensive civil rights protections with active enforcement.',
    requirements: [
      {
        code: 'WI-WFEA',
        name: 'Wisconsin Fair Employment Act',
        description: 'Prohibits discrimination in public accommodations based on disability.',
        effectiveDate: '1965-01-01',
        appliesTo: ['publicAccommodation', 'all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Compensatory damages',
          subsequentViolation: 'Civil penalties up to $10,000',
          attorneyFees: true
        },
        privateRightOfAction: true,
        demandLetterCommon: false,
        keyProvisions: [
          'Broad disability protections',
          'Strong administrative enforcement'
        ],
        resources: [
          'https://dwd.wisconsin.gov/er/'
        ]
      }
    ]
  },
  WY: {
    code: 'WY',
    name: 'Wyoming',
    riskMultiplier: 0.7,
    litigationTrend: 'stable',
    notes: 'Wyoming has minimal state-specific accessibility requirements.',
    requirements: [
      {
        code: 'WY-FEPA',
        name: 'Wyoming Fair Employment Practices Act',
        description: 'Prohibits discrimination based on disability.',
        effectiveDate: '1965-01-01',
        appliesTo: ['all'],
        wcagLevel: 'AA',
        penalties: {
          firstViolation: 'Cease and desist',
          subsequentViolation: 'Administrative action',
          attorneyFees: false
        },
        privateRightOfAction: false,
        demandLetterCommon: false,
        keyProvisions: [
          'Employment discrimination prohibited',
          'Department of Workforce Services enforcement'
        ],
        resources: [
          'https://dws.wyo.gov/'
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
