/**
 * Salary reference data for individual role pages.
 * Sources: aggregated market data from ABS, LinkedIn Salary, SEEK Insights (2024–25).
 */

export interface SalaryLevel {
  level: string    // e.g. "Junior (0–2 yrs)"
  auRange: string  // e.g. "$70k – $90k"
  nzRange: string  // e.g. "NZD $65k – $85k"
}

export interface RoleSalaryData {
  slug: string
  title: string
  industry: string
  description: string
  auMin: number
  auMax: number
  auMedian: number
  nzMin: number
  nzMax: number
  nzMedian: number
  levels: SalaryLevel[]
  topEmployers: string[]
  keywords: string[]
  relatedSlugs: string[]
}

// ─── Take-home estimator (ATO 2024–25 individual rates) ─────────────────────

export function estimateTakeHome(grossAnnual: number): {
  annual: number
  monthly: number
  fortnightly: number
} {
  let tax = 0
  if (grossAnnual <= 18200) {
    tax = 0
  } else if (grossAnnual <= 45000) {
    tax = (grossAnnual - 18200) * 0.19
  } else if (grossAnnual <= 120000) {
    tax = 5092 + (grossAnnual - 45000) * 0.325
  } else if (grossAnnual <= 180000) {
    tax = 29467 + (grossAnnual - 120000) * 0.37
  } else {
    tax = 51667 + (grossAnnual - 180000) * 0.45
  }

  // Low Income Tax Offset (LITO)
  let lito = 0
  if (grossAnnual <= 37500) {
    lito = 700
  } else if (grossAnnual <= 45000) {
    lito = 700 - (grossAnnual - 37500) * 0.05
  } else if (grossAnnual <= 66667) {
    lito = 325 - (grossAnnual - 45000) * 0.015
  }

  const medicare = grossAnnual * 0.02
  const net = Math.round(grossAnnual - tax - medicare + lito)

  return {
    annual: net,
    monthly: Math.round(net / 12),
    fortnightly: Math.round(net / 26),
  }
}

export function fmt(n: number) {
  return `$${(n / 1000).toFixed(0)}k`
}

// ─── Role data ────────────────────────────────────────────────────────────────

export const ROLES: RoleSalaryData[] = [
  // ── Technology ──────────────────────────────────────────────────────────────
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    industry: 'Technology & IT',
    description:
      'Software Engineers design, build and maintain software applications and systems. In Australia demand is consistently high, particularly in Sydney and Melbourne, with strong representation on Seek from tech companies, banks, and government agencies.',
    auMin: 80000, auMax: 150000, auMedian: 110000,
    nzMin: 70000, nzMax: 130000, nzMedian: 95000,
    levels: [
      { level: 'Graduate / Junior (0–2 yrs)', auRange: '$70k – $95k',   nzRange: 'NZD $65k – $85k'  },
      { level: 'Mid-level (2–5 yrs)',          auRange: '$95k – $130k',  nzRange: 'NZD $85k – $115k' },
      { level: 'Senior (5+ yrs)',              auRange: '$130k – $175k', nzRange: 'NZD $115k – $155k' },
      { level: 'Lead / Principal',             auRange: '$160k – $220k', nzRange: 'NZD $145k – $200k' },
    ],
    topEmployers: ['Atlassian', 'Canva', 'REA Group', 'Commonwealth Bank', 'Afterpay', 'Seek'],
    keywords: ['software engineer salary australia', 'software engineer salary seek', 'software developer salary australia 2025', 'IT salary australia'],
    relatedSlugs: ['senior-software-engineer', 'frontend-developer', 'backend-developer', 'full-stack-developer'],
  },
  {
    slug: 'senior-software-engineer',
    title: 'Senior Software Engineer',
    industry: 'Technology & IT',
    description:
      'Senior Software Engineers lead technical design, mentor junior engineers, and deliver complex features independently. Seek listings at this level frequently include leadership expectations, system design skills and often require deep expertise in one or more specific stacks.',
    auMin: 130000, auMax: 200000, auMedian: 160000,
    nzMin: 110000, nzMax: 175000, nzMedian: 140000,
    levels: [
      { level: 'Senior (5–8 yrs)',           auRange: '$130k – $165k', nzRange: 'NZD $110k – $145k' },
      { level: 'Staff / Senior+ (8–12 yrs)', auRange: '$165k – $200k', nzRange: 'NZD $145k – $175k' },
      { level: 'Principal / Architect',       auRange: '$190k – $250k', nzRange: 'NZD $170k – $225k' },
    ],
    topEmployers: ['Google', 'Atlassian', 'Canva', 'ANZ', 'Westpac', 'Xero'],
    keywords: ['senior software engineer salary australia', 'senior developer salary australia', 'senior engineer salary seek'],
    relatedSlugs: ['software-engineer', 'backend-developer', 'data-scientist'],
  },
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    industry: 'Technology & IT',
    description:
      'Frontend Developers build the user-facing parts of web applications using HTML, CSS, and JavaScript frameworks like React and Vue. Demand on Seek is strong in e-commerce, fintech and SaaS companies across Australian capital cities.',
    auMin: 75000, auMax: 145000, auMedian: 105000,
    nzMin: 65000, nzMax: 125000, nzMedian: 90000,
    levels: [
      { level: 'Junior (0–2 yrs)',  auRange: '$65k – $90k',   nzRange: 'NZD $60k – $80k'  },
      { level: 'Mid (2–5 yrs)',     auRange: '$90k – $120k',  nzRange: 'NZD $80k – $105k' },
      { level: 'Senior (5+ yrs)',   auRange: '$120k – $160k', nzRange: 'NZD $105k – $140k' },
    ],
    topEmployers: ['Afterpay', 'Canva', 'MYOB', 'Domain', 'Kogan', 'Tyro'],
    keywords: ['frontend developer salary australia', 'react developer salary australia', 'frontend salary seek'],
    relatedSlugs: ['software-engineer', 'full-stack-developer', 'ux-designer'],
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    industry: 'Technology & IT',
    description:
      'Backend Developers build server-side logic, APIs and databases. Seek listings typically specify Python, Java, Go, or Node.js. Backend roles are well-paid in Australian financial services, government and enterprise software companies.',
    auMin: 80000, auMax: 155000, auMedian: 112000,
    nzMin: 70000, nzMax: 135000, nzMedian: 97000,
    levels: [
      { level: 'Junior (0–2 yrs)', auRange: '$70k – $95k',   nzRange: 'NZD $65k – $85k'  },
      { level: 'Mid (2–5 yrs)',    auRange: '$95k – $130k',  nzRange: 'NZD $85k – $115k' },
      { level: 'Senior (5+ yrs)',  auRange: '$130k – $175k', nzRange: 'NZD $115k – $155k' },
    ],
    topEmployers: ['Commonwealth Bank', 'Atlassian', 'REA Group', 'Seek', 'ServiceNow', 'WiseTech'],
    keywords: ['backend developer salary australia', 'backend engineer salary seek', 'API developer salary australia'],
    relatedSlugs: ['software-engineer', 'full-stack-developer', 'devops-engineer'],
  },
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    industry: 'Technology & IT',
    description:
      'Full Stack Developers work across both frontend and backend, making them versatile hires. This is one of the most common job titles on Seek in Australia, especially in startups, agencies and scale-ups looking for engineers who can move fast across the whole stack.',
    auMin: 80000, auMax: 155000, auMedian: 108000,
    nzMin: 70000, nzMax: 135000, nzMedian: 95000,
    levels: [
      { level: 'Junior (0–2 yrs)', auRange: '$70k – $95k',   nzRange: 'NZD $65k – $85k'  },
      { level: 'Mid (2–5 yrs)',    auRange: '$95k – $125k',  nzRange: 'NZD $85k – $110k' },
      { level: 'Senior (5+ yrs)',  auRange: '$125k – $170k', nzRange: 'NZD $110k – $150k' },
    ],
    topEmployers: ['Envato', 'Culture Amp', 'Rokt', 'Immutable', 'Buildkite', 'SafetyCulture'],
    keywords: ['full stack developer salary australia', 'full stack engineer salary seek', 'full stack developer pay australia'],
    relatedSlugs: ['software-engineer', 'frontend-developer', 'backend-developer'],
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    industry: 'Technology & IT',
    description:
      'Data Scientists build predictive models, analyse large datasets and translate findings into business decisions. Australian demand is strongest in fintech, retail, and healthcare. Seek listings frequently ask for Python, SQL, and ML frameworks like TensorFlow or PyTorch.',
    auMin: 100000, auMax: 165000, auMedian: 128000,
    nzMin: 90000, nzMax: 145000, nzMedian: 112000,
    levels: [
      { level: 'Graduate / Junior', auRange: '$85k – $110k',  nzRange: 'NZD $75k – $98k'  },
      { level: 'Mid-level',         auRange: '$110k – $140k', nzRange: 'NZD $98k – $125k' },
      { level: 'Senior',            auRange: '$140k – $180k', nzRange: 'NZD $125k – $160k' },
      { level: 'Principal / Lead',  auRange: '$170k – $220k', nzRange: 'NZD $150k – $200k' },
    ],
    topEmployers: ['Commonwealth Bank', 'NAB', 'Woolworths Group', 'Telstra', 'CSIRO', 'Quantium'],
    keywords: ['data scientist salary australia', 'data science salary seek', 'machine learning engineer salary australia'],
    relatedSlugs: ['data-analyst', 'machine-learning-engineer', 'software-engineer'],
  },
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    industry: 'Technology & IT',
    description:
      'Data Analysts extract insights from business data using SQL, Excel, and visualisation tools like Power BI or Tableau. Data analyst is one of the most common entry paths into data in Australia, and Seek has many listings across every industry sector.',
    auMin: 65000, auMax: 115000, auMedian: 87000,
    nzMin: 58000, nzMax: 100000, nzMedian: 78000,
    levels: [
      { level: 'Junior (0–2 yrs)', auRange: '$60k – $80k',   nzRange: 'NZD $55k – $72k'  },
      { level: 'Mid (2–5 yrs)',    auRange: '$80k – $105k',  nzRange: 'NZD $72k – $93k'  },
      { level: 'Senior (5+ yrs)',  auRange: '$105k – $135k', nzRange: 'NZD $93k – $120k' },
    ],
    topEmployers: ['NAB', 'IAG', 'Medibank', 'Woolworths', 'Telstra', 'Transport NSW'],
    keywords: ['data analyst salary australia', 'data analyst salary seek', 'business analyst salary australia'],
    relatedSlugs: ['data-scientist', 'machine-learning-engineer', 'product-manager'],
  },
  {
    slug: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    industry: 'Technology & IT',
    description:
      'Machine Learning Engineers build and deploy ML systems at scale, bridging data science and production software engineering. This is one of the fastest-growing and highest-paid roles on Seek in Australia, driven by AI adoption across industries.',
    auMin: 110000, auMax: 185000, auMedian: 145000,
    nzMin: 98000, nzMax: 160000, nzMedian: 128000,
    levels: [
      { level: 'Junior / Graduate', auRange: '$95k – $120k',  nzRange: 'NZD $85k – $108k' },
      { level: 'Mid-level',         auRange: '$120k – $155k', nzRange: 'NZD $108k – $138k' },
      { level: 'Senior',            auRange: '$155k – $200k', nzRange: 'NZD $138k – $178k' },
    ],
    topEmployers: ['Atlassian', 'Canva', 'Commonwealth Bank', 'Cochlear', 'Rokt', 'Immutable'],
    keywords: ['machine learning engineer salary australia', 'ML engineer salary seek', 'AI engineer salary australia'],
    relatedSlugs: ['data-scientist', 'software-engineer', 'data-analyst'],
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    industry: 'Technology & IT',
    description:
      'Product Managers own the roadmap for digital products, working across engineering, design and business stakeholders. Senior PM roles on Seek in Australia consistently offer packages above $150k, particularly in high-growth tech companies.',
    auMin: 110000, auMax: 180000, auMedian: 140000,
    nzMin: 98000, nzMax: 158000, nzMedian: 122000,
    levels: [
      { level: 'Associate PM',           auRange: '$90k – $115k',  nzRange: 'NZD $80k – $100k' },
      { level: 'Product Manager',        auRange: '$115k – $155k', nzRange: 'NZD $100k – $135k' },
      { level: 'Senior PM',              auRange: '$155k – $200k', nzRange: 'NZD $135k – $175k' },
      { level: 'Group / Director of PM', auRange: '$190k – $260k', nzRange: 'NZD $170k – $230k' },
    ],
    topEmployers: ['Atlassian', 'Canva', 'REA Group', 'Afterpay', 'Seek', 'Xero'],
    keywords: ['product manager salary australia', 'product manager salary seek', 'PM salary australia 2025'],
    relatedSlugs: ['data-analyst', 'ux-designer', 'software-engineer'],
  },
  {
    slug: 'ux-designer',
    title: 'UX Designer',
    industry: 'Technology & IT',
    description:
      'UX Designers research user behaviour and create intuitive product interfaces. In Australia, UX roles are concentrated in tech companies and digital agencies. Seek listings at mid-senior level often ask for Figma, research skills, and experience with design systems.',
    auMin: 80000, auMax: 135000, auMedian: 103000,
    nzMin: 70000, nzMax: 118000, nzMedian: 92000,
    levels: [
      { level: 'Junior UX Designer', auRange: '$68k – $88k',   nzRange: 'NZD $60k – $80k'  },
      { level: 'UX Designer',        auRange: '$88k – $115k',  nzRange: 'NZD $80k – $100k' },
      { level: 'Senior UX Designer', auRange: '$115k – $150k', nzRange: 'NZD $100k – $130k' },
      { level: 'UX Lead / Manager',  auRange: '$145k – $185k', nzRange: 'NZD $128k – $162k' },
    ],
    topEmployers: ['Canva', 'Atlassian', 'ANZ', 'Seek', 'Telstra', 'Domain'],
    keywords: ['UX designer salary australia', 'UI UX salary seek', 'product designer salary australia'],
    relatedSlugs: ['product-manager', 'frontend-developer', 'digital-marketing-specialist'],
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps / Cloud Engineer',
    industry: 'Technology & IT',
    description:
      'DevOps and Cloud Engineers automate infrastructure, manage CI/CD pipelines, and ensure system reliability. AWS, Azure and GCP certifications are frequently listed as requirements on Seek. This is one of the highest-demand roles in Australian technology.',
    auMin: 110000, auMax: 180000, auMedian: 140000,
    nzMin: 98000, nzMax: 158000, nzMedian: 122000,
    levels: [
      { level: 'Junior Cloud Engineer', auRange: '$85k – $110k',  nzRange: 'NZD $75k – $98k'  },
      { level: 'DevOps Engineer',       auRange: '$110k – $150k', nzRange: 'NZD $98k – $132k' },
      { level: 'Senior DevOps',         auRange: '$150k – $190k', nzRange: 'NZD $132k – $168k' },
      { level: 'Platform Lead',         auRange: '$180k – $230k', nzRange: 'NZD $160k – $205k' },
    ],
    topEmployers: ['Atlassian', 'Commonwealth Bank', 'Telstra', 'Iress', 'WiseTech', 'REA Group'],
    keywords: ['devops engineer salary australia', 'cloud engineer salary seek', 'AWS engineer salary australia'],
    relatedSlugs: ['software-engineer', 'backend-developer', 'machine-learning-engineer'],
  },
  {
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    industry: 'Technology & IT',
    description:
      'Cybersecurity Analysts protect organisations from cyber threats, monitor for incidents and ensure compliance. The Australian government\'s increasing focus on cybersecurity has driven strong growth in Seek listings for this role across both public and private sectors.',
    auMin: 85000, auMax: 150000, auMedian: 112000,
    nzMin: 75000, nzMax: 132000, nzMedian: 100000,
    levels: [
      { level: 'Junior Analyst',   auRange: '$75k – $98k',   nzRange: 'NZD $65k – $88k'  },
      { level: 'Analyst',          auRange: '$98k – $125k',  nzRange: 'NZD $88k – $112k' },
      { level: 'Senior Analyst',   auRange: '$125k – $160k', nzRange: 'NZD $112k – $142k' },
      { level: 'Security Manager', auRange: '$155k – $210k', nzRange: 'NZD $138k – $186k' },
    ],
    topEmployers: ['Deloitte', 'PwC', 'Commonwealth Bank', 'ASD', 'Telstra', 'BAE Systems'],
    keywords: ['cybersecurity analyst salary australia', 'infosec salary seek', 'security engineer salary australia'],
    relatedSlugs: ['software-engineer', 'devops-engineer', 'data-analyst'],
  },

  // ── Finance ──────────────────────────────────────────────────────────────────
  {
    slug: 'financial-analyst',
    title: 'Financial Analyst',
    industry: 'Finance & Banking',
    description:
      'Financial Analysts evaluate investments, build financial models, and produce reports for management decisions. Seek listings for this role are common in Australia\'s big banks, funds management, and ASX-listed corporates, often requiring CFA or accounting qualifications.',
    auMin: 70000, auMax: 115000, auMedian: 88000,
    nzMin: 65000, nzMax: 100000, nzMedian: 80000,
    levels: [
      { level: 'Graduate / Analyst', auRange: '$65k – $85k',  nzRange: 'NZD $60k – $78k'  },
      { level: 'Senior Analyst',     auRange: '$85k – $110k', nzRange: 'NZD $78k – $100k' },
      { level: 'Manager / Lead',     auRange: '$110k – $150k',nzRange: 'NZD $100k – $135k' },
    ],
    topEmployers: ['Commonwealth Bank', 'NAB', 'ANZ', 'Westpac', 'Macquarie', 'AMP'],
    keywords: ['financial analyst salary australia', 'finance analyst salary seek', 'CFA salary australia'],
    relatedSlugs: ['accountant', 'risk-manager', 'investment-banker'],
  },
  {
    slug: 'accountant',
    title: 'Accountant',
    industry: 'Finance & Banking',
    description:
      'Accountants prepare financial statements, manage tax obligations and provide compliance advice. Seek has thousands of accountant roles across Australia at any time, from small practices to Big 4 firms. CA or CPA accreditation significantly increases salary at senior levels.',
    auMin: 65000, auMax: 110000, auMedian: 82000,
    nzMin: 60000, nzMax: 96000, nzMedian: 75000,
    levels: [
      { level: 'Graduate / Junior',  auRange: '$55k – $75k',  nzRange: 'NZD $50k – $68k'  },
      { level: 'Intermediate (CA)',  auRange: '$75k – $100k', nzRange: 'NZD $68k – $90k'  },
      { level: 'Senior Accountant',  auRange: '$100k – $130k',nzRange: 'NZD $90k – $118k' },
      { level: 'Manager',            auRange: '$130k – $170k',nzRange: 'NZD $118k – $152k' },
    ],
    topEmployers: ['PwC', 'Deloitte', 'KPMG', 'EY', 'Grant Thornton', 'BDO'],
    keywords: ['accountant salary australia', 'CA salary australia seek', 'CPA salary australia'],
    relatedSlugs: ['financial-analyst', 'tax-accountant', 'risk-manager'],
  },
  {
    slug: 'tax-accountant',
    title: 'Tax Accountant',
    industry: 'Finance & Banking',
    description:
      'Tax Accountants specialise in managing tax compliance and minimisation strategies for businesses and individuals. Seek listings for tax specialists attract premiums over general accounting roles, particularly in Big 4 firms and mid-tier practices.',
    auMin: 70000, auMax: 125000, auMedian: 92000,
    nzMin: 65000, nzMax: 110000, nzMedian: 84000,
    levels: [
      { level: 'Graduate / Junior', auRange: '$60k – $78k',  nzRange: 'NZD $55k – $70k'  },
      { level: 'Tax Accountant',    auRange: '$78k – $105k', nzRange: 'NZD $70k – $95k'  },
      { level: 'Senior Tax',        auRange: '$105k – $140k',nzRange: 'NZD $95k – $125k' },
      { level: 'Tax Manager',       auRange: '$140k – $190k',nzRange: 'NZD $125k – $170k' },
    ],
    topEmployers: ['Deloitte', 'PwC', 'KPMG', 'EY', 'H&R Block', 'Pitcher Partners'],
    keywords: ['tax accountant salary australia', 'tax specialist salary seek', 'tax manager salary australia'],
    relatedSlugs: ['accountant', 'financial-analyst', 'financial-planner'],
  },
  {
    slug: 'financial-planner',
    title: 'Financial Planner',
    industry: 'Finance & Banking',
    description:
      'Financial Planners provide personal advice on investments, superannuation, insurance and retirement. After FASEA reforms, all Australian financial planners must hold an approved degree. Seek listings often include a base salary plus commission structure.',
    auMin: 70000, auMax: 140000, auMedian: 98000,
    nzMin: 65000, nzMax: 120000, nzMedian: 88000,
    levels: [
      { level: 'Paraplanner / Associate', auRange: '$65k – $85k',  nzRange: 'NZD $60k – $78k'  },
      { level: 'Financial Planner',       auRange: '$85k – $120k', nzRange: 'NZD $78k – $108k' },
      { level: 'Senior Planner',          auRange: '$120k – $165k',nzRange: 'NZD $108k – $148k' },
    ],
    topEmployers: ['AMP', 'MLC', 'BT', 'Colonial First State', 'Macquarie', 'Dixon Advisory'],
    keywords: ['financial planner salary australia', 'financial adviser salary seek', 'CFP salary australia'],
    relatedSlugs: ['accountant', 'financial-analyst', 'risk-manager'],
  },
  {
    slug: 'risk-manager',
    title: 'Risk Manager',
    industry: 'Finance & Banking',
    description:
      'Risk Managers identify, assess and mitigate financial, operational and regulatory risks. This is a high-demand role in Australian banking and insurance. Seek listings frequently require FRM, CFA, or actuarial qualifications for senior appointments.',
    auMin: 110000, auMax: 175000, auMedian: 138000,
    nzMin: 98000, nzMax: 155000, nzMedian: 122000,
    levels: [
      { level: 'Risk Analyst',     auRange: '$85k – $110k',  nzRange: 'NZD $75k – $98k'  },
      { level: 'Risk Manager',     auRange: '$110k – $150k', nzRange: 'NZD $98k – $132k' },
      { level: 'Senior Manager',   auRange: '$150k – $195k', nzRange: 'NZD $132k – $172k' },
      { level: 'Head of Risk',     auRange: '$190k – $260k', nzRange: 'NZD $170k – $232k' },
    ],
    topEmployers: ['Commonwealth Bank', 'NAB', 'ANZ', 'Westpac', 'QBE', 'IAG'],
    keywords: ['risk manager salary australia', 'risk management salary seek', 'FRM salary australia'],
    relatedSlugs: ['financial-analyst', 'accountant', 'investment-banker'],
  },
  {
    slug: 'investment-banker',
    title: 'Investment Banker',
    industry: 'Finance & Banking',
    description:
      'Investment Bankers advise on capital raising, M&A transactions and corporate strategy. Seek listings at analyst level in Australia are rare — most entry-level IBD roles are filled via direct campus programs — but Associate and VP-level listings do appear.',
    auMin: 90000, auMax: 200000, auMedian: 140000,
    nzMin: 80000, nzMax: 175000, nzMedian: 125000,
    levels: [
      { level: 'Analyst (1–3 yrs)',    auRange: '$90k – $120k',  nzRange: 'NZD $80k – $108k' },
      { level: 'Associate (3–6 yrs)',  auRange: '$120k – $175k', nzRange: 'NZD $108k – $155k' },
      { level: 'VP / Director',        auRange: '$175k – $300k', nzRange: 'NZD $155k – $270k' },
    ],
    topEmployers: ['Macquarie', 'Goldman Sachs', 'Morgan Stanley', 'UBS', 'Barrenjoey', 'Jarden'],
    keywords: ['investment banker salary australia', 'IBD salary australia seek', 'M&A analyst salary australia'],
    relatedSlugs: ['financial-analyst', 'risk-manager', 'accountant'],
  },

  // ── Healthcare ───────────────────────────────────────────────────────────────
  {
    slug: 'registered-nurse',
    title: 'Registered Nurse',
    industry: 'Healthcare & Medical',
    description:
      'Registered Nurses provide direct patient care in hospitals, clinics and community settings. Seek is a primary recruitment channel for nursing roles across Australia. Salaries are governed by EBA agreements and vary by state, shift type and specialty area.',
    auMin: 68000, auMax: 105000, auMedian: 82000,
    nzMin: 60000, nzMax: 90000, nzMedian: 73000,
    levels: [
      { level: 'RN (New Grad / Yr 1)', auRange: '$65k – $75k',  nzRange: 'NZD $58k – $68k'  },
      { level: 'RN (2–5 yrs)',          auRange: '$75k – $92k',  nzRange: 'NZD $68k – $83k'  },
      { level: 'Experienced RN (5+ yrs)',auRange: '$90k – $110k',nzRange: 'NZD $82k – $98k'  },
      { level: 'Clinical Nurse Specialist',auRange: '$105k – $125k',nzRange: 'NZD $95k – $112k' },
    ],
    topEmployers: ['NSW Health', 'Alfred Health', 'Melbourne Health', 'Royal Brisbane', 'St Vincent\'s'],
    keywords: ['registered nurse salary australia', 'RN salary seek', 'nurse salary australia 2025', 'nursing salary australia'],
    relatedSlugs: ['general-practitioner', 'physiotherapist', 'occupational-therapist'],
  },
  {
    slug: 'general-practitioner',
    title: 'General Practitioner (GP)',
    industry: 'Healthcare & Medical',
    description:
      'General Practitioners provide primary care to patients. GPs in Australia are among the highest-paid professionals, particularly those running or managing their own practice. Seek listings for GP roles often quote daily rates or package arrangements.',
    auMin: 150000, auMax: 280000, auMedian: 210000,
    nzMin: 130000, nzMax: 250000, nzMedian: 185000,
    levels: [
      { level: 'GP Registrar',       auRange: '$100k – $140k', nzRange: 'NZD $90k – $125k' },
      { level: 'Vocationally Reg. GP',auRange: '$150k – $220k', nzRange: 'NZD $135k – $195k' },
      { level: 'Experienced GP',     auRange: '$220k – $300k+', nzRange: 'NZD $195k – $270k+' },
    ],
    topEmployers: ['Healius', 'Primary Health Care', 'IPN Medical Centres', 'Sonic HealthPlus'],
    keywords: ['GP salary australia', 'general practitioner salary seek', 'doctor salary australia 2025'],
    relatedSlugs: ['registered-nurse', 'pharmacist', 'physiotherapist'],
  },
  {
    slug: 'pharmacist',
    title: 'Pharmacist',
    industry: 'Healthcare & Medical',
    description:
      'Pharmacists dispense medications, counsel patients and advise on drug interactions. Seek listings for pharmacist roles in Australia span community pharmacy, hospital and compounding, with hospital roles typically offering higher base salaries.',
    auMin: 80000, auMax: 125000, auMedian: 98000,
    nzMin: 75000, nzMax: 110000, nzMedian: 90000,
    levels: [
      { level: 'Intern / New Grad',     auRange: '$60k – $78k',  nzRange: 'NZD $55k – $70k'  },
      { level: 'Registered Pharmacist', auRange: '$78k – $105k', nzRange: 'NZD $70k – $95k'  },
      { level: 'Senior / Hospital',     auRange: '$105k – $135k',nzRange: 'NZD $95k – $120k' },
      { level: 'Pharmacy Manager',      auRange: '$130k – $165k',nzRange: 'NZD $118k – $148k' },
    ],
    topEmployers: ['Chemist Warehouse', 'Priceline', 'TerryWhite Chemmart', 'NSW Health', 'Alfred Health'],
    keywords: ['pharmacist salary australia', 'pharmacy salary seek', 'hospital pharmacist salary australia'],
    relatedSlugs: ['registered-nurse', 'general-practitioner', 'occupational-therapist'],
  },
  {
    slug: 'physiotherapist',
    title: 'Physiotherapist',
    industry: 'Healthcare & Medical',
    description:
      'Physiotherapists assess and treat musculoskeletal, neurological and cardiopulmonary conditions. Private practice Physio roles on Seek in Australia often include base + incentive structures, while public sector roles are EBA-governed.',
    auMin: 68000, auMax: 112000, auMedian: 86000,
    nzMin: 62000, nzMax: 100000, nzMedian: 78000,
    levels: [
      { level: 'New Graduate',          auRange: '$62k – $78k',  nzRange: 'NZD $58k – $72k'  },
      { level: 'Physiotherapist',       auRange: '$78k – $100k', nzRange: 'NZD $72k – $90k'  },
      { level: 'Senior Physiotherapist',auRange: '$100k – $125k',nzRange: 'NZD $90k – $112k' },
    ],
    topEmployers: ['Physio Inq', 'Back In Motion', 'TotalFusion', 'NSW Health', 'Ramsay Health'],
    keywords: ['physiotherapist salary australia', 'physio salary seek', 'physiotherapy salary australia 2025'],
    relatedSlugs: ['registered-nurse', 'occupational-therapist', 'general-practitioner'],
  },
  {
    slug: 'occupational-therapist',
    title: 'Occupational Therapist',
    industry: 'Healthcare & Medical',
    description:
      'Occupational Therapists help clients regain independence in daily activities following illness or injury. NDIS growth has significantly increased OT demand in Australia, with many Seek listings offering competitive salaries and generous professional development.',
    auMin: 70000, auMax: 110000, auMedian: 86000,
    nzMin: 64000, nzMax: 98000, nzMedian: 78000,
    levels: [
      { level: 'New Graduate',  auRange: '$64k – $80k',  nzRange: 'NZD $58k – $73k'  },
      { level: 'OT (2–5 yrs)',  auRange: '$80k – $100k', nzRange: 'NZD $73k – $90k'  },
      { level: 'Senior OT',     auRange: '$100k – $125k',nzRange: 'NZD $90k – $112k' },
    ],
    topEmployers: ['EnableNSW', 'Ability First Australia', 'The OT Practice', 'Estia Health', 'Anglicare'],
    keywords: ['occupational therapist salary australia', 'OT salary seek', 'NDIS OT salary australia'],
    relatedSlugs: ['physiotherapist', 'registered-nurse', 'general-practitioner'],
  },

  // ── Engineering ───────────────────────────────────────────────────────────────
  {
    slug: 'civil-engineer',
    title: 'Civil Engineer',
    industry: 'Engineering',
    description:
      'Civil Engineers design and oversee infrastructure projects including roads, bridges, tunnels and water systems. Major infrastructure investment across Australia has kept Seek demand for civil engineers consistently high, especially in NSW and QLD.',
    auMin: 75000, auMax: 135000, auMedian: 100000,
    nzMin: 70000, nzMax: 120000, nzMedian: 92000,
    levels: [
      { level: 'Graduate (0–2 yrs)', auRange: '$65k – $85k',  nzRange: 'NZD $60k – $78k'  },
      { level: 'Engineer (2–5 yrs)', auRange: '$85k – $110k', nzRange: 'NZD $78k – $100k' },
      { level: 'Senior (5+ yrs)',    auRange: '$110k – $145k',nzRange: 'NZD $100k – $130k' },
      { level: 'Principal',          auRange: '$145k – $185k',nzRange: 'NZD $130k – $165k' },
    ],
    topEmployers: ['AECOM', 'WSP', 'Aurecon', 'GHD', 'Jacobs', 'Transport for NSW'],
    keywords: ['civil engineer salary australia', 'civil engineering salary seek', 'structural engineer salary australia'],
    relatedSlugs: ['structural-engineer', 'mechanical-engineer', 'electrical-engineer'],
  },
  {
    slug: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    industry: 'Engineering',
    description:
      'Mechanical Engineers design and analyse mechanical systems, machinery and thermal equipment. Seek demand in Australia is strong in mining, defence, and manufacturing sectors, with Perth and Brisbane offering the highest mechanical engineering salaries.',
    auMin: 75000, auMax: 135000, auMedian: 100000,
    nzMin: 70000, nzMax: 118000, nzMedian: 91000,
    levels: [
      { level: 'Graduate (0–2 yrs)', auRange: '$65k – $85k',  nzRange: 'NZD $60k – $78k'  },
      { level: 'Engineer (2–5 yrs)', auRange: '$85k – $112k', nzRange: 'NZD $78k – $100k' },
      { level: 'Senior (5+ yrs)',    auRange: '$112k – $150k',nzRange: 'NZD $100k – $132k' },
    ],
    topEmployers: ['BHP', 'Rio Tinto', 'Worley', 'Boeing', 'AECOM', 'Thales'],
    keywords: ['mechanical engineer salary australia', 'mechanical engineering salary seek', 'engineer salary australia 2025'],
    relatedSlugs: ['civil-engineer', 'electrical-engineer', 'structural-engineer'],
  },
  {
    slug: 'electrical-engineer',
    title: 'Electrical Engineer',
    industry: 'Engineering',
    description:
      'Electrical Engineers design power systems, electronics, and control systems. Renewable energy growth has expanded Seek demand for electrical engineers significantly, with solar and grid-scale battery projects adding new high-paying specialist roles.',
    auMin: 80000, auMax: 145000, auMedian: 108000,
    nzMin: 75000, nzMax: 128000, nzMedian: 97000,
    levels: [
      { level: 'Graduate (0–2 yrs)', auRange: '$68k – $90k',  nzRange: 'NZD $62k – $82k'  },
      { level: 'Engineer (2–5 yrs)', auRange: '$90k – $120k', nzRange: 'NZD $82k – $108k' },
      { level: 'Senior (5+ yrs)',    auRange: '$120k – $158k',nzRange: 'NZD $108k – $140k' },
    ],
    topEmployers: ['TransGrid', 'AGL', 'Origin Energy', 'ElectraNet', 'John Holland', 'Ventia'],
    keywords: ['electrical engineer salary australia', 'electrical engineering salary seek', 'power systems engineer salary australia'],
    relatedSlugs: ['civil-engineer', 'mechanical-engineer', 'structural-engineer'],
  },
  {
    slug: 'structural-engineer',
    title: 'Structural Engineer',
    industry: 'Engineering',
    description:
      'Structural Engineers design and assess load-bearing elements in buildings and infrastructure. The ongoing residential and commercial construction boom in Australia keeps Seek busy with structural engineering listings, particularly in Sydney and Melbourne.',
    auMin: 78000, auMax: 138000, auMedian: 102000,
    nzMin: 74000, nzMax: 122000, nzMedian: 94000,
    levels: [
      { level: 'Graduate (0–2 yrs)', auRange: '$68k – $88k',  nzRange: 'NZD $64k – $82k'  },
      { level: 'Engineer (2–5 yrs)', auRange: '$88k – $115k', nzRange: 'NZD $82k – $104k' },
      { level: 'Senior (5+ yrs)',    auRange: '$115k – $150k',nzRange: 'NZD $104k – $135k' },
      { level: 'Principal',          auRange: '$148k – $190k',nzRange: 'NZD $134k – $170k' },
    ],
    topEmployers: ['Arup', 'Hyder Consulting', 'Mott MacDonald', 'Arcadis', 'John Holland', 'Lendlease'],
    keywords: ['structural engineer salary australia', 'structural engineering salary seek', 'building engineer salary australia'],
    relatedSlugs: ['civil-engineer', 'mechanical-engineer', 'electrical-engineer'],
  },

  // ── Education ────────────────────────────────────────────────────────────────
  {
    slug: 'primary-school-teacher',
    title: 'Primary School Teacher',
    industry: 'Education',
    description:
      'Primary School Teachers educate children from Kindergarten to Year 6. Teaching salaries in Australia are set by state EBA agreements. Independent and Catholic schools advertise salary ranges on Seek that often differ from the public-sector base.',
    auMin: 68000, auMax: 105000, auMedian: 82000,
    nzMin: 55000, nzMax: 90000, nzMedian: 70000,
    levels: [
      { level: 'Graduate (Band 1)',   auRange: '$68k – $78k',  nzRange: 'NZD $55k – $65k'  },
      { level: 'Experienced (Band 3)',auRange: '$85k – $100k', nzRange: 'NZD $70k – $83k'  },
      { level: 'Leading Teacher',     auRange: '$100k – $115k',nzRange: 'NZD $83k – $95k'  },
    ],
    topEmployers: ['NSW Department of Education', 'Catholic Education', 'Independent Schools', 'Victorian DET'],
    keywords: ['primary school teacher salary australia', 'teacher salary seek', 'primary teacher salary australia 2025'],
    relatedSlugs: ['secondary-school-teacher', 'university-lecturer'],
  },
  {
    slug: 'secondary-school-teacher',
    title: 'Secondary School Teacher',
    industry: 'Education',
    description:
      'Secondary School Teachers educate students in Years 7–12, typically specialising in one or two subject areas. STEM teacher shortages have led to improved salaries and incentives on Seek, particularly for Maths and Science teachers in regional areas.',
    auMin: 72000, auMax: 108000, auMedian: 86000,
    nzMin: 60000, nzMax: 93000, nzMedian: 74000,
    levels: [
      { level: 'Graduate (Band 1)',   auRange: '$72k – $82k',  nzRange: 'NZD $60k – $70k'  },
      { level: 'Experienced (Band 3)',auRange: '$88k – $103k', nzRange: 'NZD $75k – $86k'  },
      { level: 'Leading Teacher',     auRange: '$103k – $118k',nzRange: 'NZD $86k – $97k'  },
    ],
    topEmployers: ['NSW DoE', 'QLD DoE', 'Scotch College', 'Geelong Grammar', 'Xavier College'],
    keywords: ['secondary school teacher salary australia', 'high school teacher salary seek', 'STEM teacher salary australia'],
    relatedSlugs: ['primary-school-teacher', 'university-lecturer'],
  },
  {
    slug: 'university-lecturer',
    title: 'University Lecturer',
    industry: 'Education',
    description:
      'University Lecturers teach undergraduate and postgraduate students while contributing to research. Academic salaries in Australia are set by EBA and vary by level (A–E). Seek also lists adjunct and casual positions which are paid per session.',
    auMin: 95000, auMax: 165000, auMedian: 125000,
    nzMin: 88000, nzMax: 148000, nzMedian: 115000,
    levels: [
      { level: 'Level A (Tutor/Associate)', auRange: '$75k – $95k',  nzRange: 'NZD $70k – $88k'  },
      { level: 'Level B (Lecturer)',        auRange: '$105k – $125k',nzRange: 'NZD $96k – $115k' },
      { level: 'Level C (Senior Lecturer)', auRange: '$128k – $150k',nzRange: 'NZD $118k – $138k' },
      { level: 'Level D (Associate Prof)',  auRange: '$158k – $180k',nzRange: 'NZD $145k – $165k' },
    ],
    topEmployers: ['University of Melbourne', 'UNSW', 'ANU', 'University of Sydney', 'Monash', 'UQ'],
    keywords: ['university lecturer salary australia', 'academic salary seek', 'professor salary australia 2025'],
    relatedSlugs: ['primary-school-teacher', 'secondary-school-teacher'],
  },

  // ── Legal ────────────────────────────────────────────────────────────────────
  {
    slug: 'solicitor',
    title: 'Solicitor / Lawyer',
    industry: 'Legal',
    description:
      'Solicitors and lawyers advise clients on legal matters, draft documents and represent clients in proceedings. Seek listings span private practice, in-house, and government. Big-law firm salaries are highest, particularly for corporate and litigation specialists.',
    auMin: 70000, auMax: 200000, auMedian: 115000,
    nzMin: 65000, nzMax: 175000, nzMedian: 105000,
    levels: [
      { level: 'Graduate / Paralegal', auRange: '$55k – $78k',  nzRange: 'NZD $50k – $72k'  },
      { level: 'Solicitor (1–3 PAE)',  auRange: '$78k – $110k', nzRange: 'NZD $72k – $100k' },
      { level: 'Senior (3–7 PAE)',     auRange: '$110k – $170k',nzRange: 'NZD $100k – $152k' },
      { level: 'Special Counsel',      auRange: '$170k – $250k',nzRange: 'NZD $152k – $225k' },
    ],
    topEmployers: ['MinterEllison', 'Allens', 'Herbert Smith Freehills', 'King & Wood Mallesons', 'Clayton Utz'],
    keywords: ['solicitor salary australia', 'lawyer salary seek', 'legal salary australia 2025', 'barrister salary australia'],
    relatedSlugs: ['in-house-counsel', 'risk-manager', 'financial-analyst'],
  },
  {
    slug: 'in-house-counsel',
    title: 'In-house Counsel',
    industry: 'Legal',
    description:
      'In-house Counsel manage the legal affairs of a single organisation rather than a law firm client base. This is a sought-after career path on Seek, typically offering better work-life balance than private practice with salaries that can exceed top-tier firm rates.',
    auMin: 120000, auMax: 210000, auMedian: 158000,
    nzMin: 108000, nzMax: 185000, nzMedian: 140000,
    levels: [
      { level: 'In-house Solicitor', auRange: '$110k – $145k', nzRange: 'NZD $98k – $130k'  },
      { level: 'Senior Counsel',     auRange: '$145k – $185k', nzRange: 'NZD $130k – $165k' },
      { level: 'General Counsel',    auRange: '$185k – $300k+',nzRange: 'NZD $165k – $270k+' },
    ],
    topEmployers: ['Westpac', 'BHP', 'Woolworths Group', 'Telstra', 'ASX', 'Transurban'],
    keywords: ['in-house counsel salary australia', 'general counsel salary seek', 'corporate lawyer salary australia'],
    relatedSlugs: ['solicitor', 'risk-manager', 'financial-analyst'],
  },

  // ── Trades ───────────────────────────────────────────────────────────────────
  {
    slug: 'electrician',
    title: 'Electrician',
    industry: 'Trades & Services',
    description:
      'Electricians install and maintain electrical systems in residential, commercial and industrial settings. The renewable energy boom — solar installations and EV charging — is expanding demand on Seek significantly. Licenced electricians command strong wages across all states.',
    auMin: 70000, auMax: 115000, auMedian: 88000,
    nzMin: 65000, nzMax: 105000, nzMedian: 82000,
    levels: [
      { level: 'Apprentice (Yr 3–4)', auRange: '$42k – $58k',  nzRange: 'NZD $38k – $52k'  },
      { level: 'Licenced Electrician',auRange: '$70k – $92k',  nzRange: 'NZD $65k – $85k'  },
      { level: 'Leading Hand',        auRange: '$92k – $115k', nzRange: 'NZD $85k – $105k' },
      { level: 'Electrical Foreman',  auRange: '$112k – $140k',nzRange: 'NZD $102k – $126k' },
    ],
    topEmployers: ['Ausgrid', 'Ventia', 'Lend Lease', 'John Holland', 'Ampcontrol', 'Programmed'],
    keywords: ['electrician salary australia', 'electrician pay seek', 'trades salary australia 2025'],
    relatedSlugs: ['plumber', 'carpenter'],
  },
  {
    slug: 'plumber',
    title: 'Plumber',
    industry: 'Trades & Services',
    description:
      'Plumbers install and repair piping systems for water, gas and drainage. Self-employed and contracting plumbers in Australia can earn significantly more than the listed base rates. Seek listings often quote hourly rates for contracting roles.',
    auMin: 68000, auMax: 110000, auMedian: 85000,
    nzMin: 63000, nzMax: 102000, nzMedian: 79000,
    levels: [
      { level: 'Apprentice (Yr 3–4)',  auRange: '$40k – $56k', nzRange: 'NZD $36k – $50k'  },
      { level: 'Licenced Plumber',     auRange: '$68k – $90k', nzRange: 'NZD $63k – $83k'  },
      { level: 'Supervisor / Foreman', auRange: '$90k – $115k',nzRange: 'NZD $83k – $106k' },
    ],
    topEmployers: ['Plumbers on Call', 'Ventia', 'Icon Water', 'SA Water', 'Transurban', 'Lend Lease'],
    keywords: ['plumber salary australia', 'plumber pay seek', 'plumbing salary australia 2025'],
    relatedSlugs: ['electrician', 'carpenter'],
  },
  {
    slug: 'carpenter',
    title: 'Carpenter',
    industry: 'Trades & Services',
    description:
      'Carpenters construct and repair building frameworks and fixtures. Residential construction activity drives strong Seek demand for carpenters in major cities. Working as a subcontractor substantially increases earning potential above the employed base rate.',
    auMin: 65000, auMax: 105000, auMedian: 82000,
    nzMin: 60000, nzMax: 95000, nzMedian: 76000,
    levels: [
      { level: 'Apprentice (Yr 3–4)', auRange: '$38k – $54k', nzRange: 'NZD $34k – $48k'  },
      { level: 'Qualified Carpenter', auRange: '$65k – $85k', nzRange: 'NZD $60k – $78k'  },
      { level: 'Leading Hand',        auRange: '$85k – $108k',nzRange: 'NZD $78k – $98k'  },
    ],
    topEmployers: ['Lend Lease', 'Multiplex', 'ADCO', 'Hansen Yuncken', 'Buildcorp', 'Roberts Co'],
    keywords: ['carpenter salary australia', 'carpenter pay seek', 'cabinet maker salary australia'],
    relatedSlugs: ['electrician', 'plumber'],
  },

  // ── Marketing ────────────────────────────────────────────────────────────────
  {
    slug: 'marketing-manager',
    title: 'Marketing Manager',
    industry: 'Marketing & Communications',
    description:
      'Marketing Managers plan and execute marketing strategies across channels. Seek lists hundreds of Marketing Manager roles at any time in Australia, spanning FMCG, tech, financial services and retail. Digital fluency is now an expected baseline skill.',
    auMin: 90000, auMax: 145000, auMedian: 112000,
    nzMin: 80000, nzMax: 128000, nzMedian: 100000,
    levels: [
      { level: 'Marketing Coordinator', auRange: '$60k – $78k',  nzRange: 'NZD $55k – $72k'  },
      { level: 'Marketing Manager',     auRange: '$90k – $120k', nzRange: 'NZD $80k – $108k' },
      { level: 'Senior Manager',        auRange: '$120k – $155k',nzRange: 'NZD $108k – $138k' },
      { level: 'Head of Marketing',     auRange: '$155k – $220k',nzRange: 'NZD $138k – $195k' },
    ],
    topEmployers: ['Woolworths', 'Coles', 'CommBank', 'Telstra', 'Lion', 'Seek'],
    keywords: ['marketing manager salary australia', 'marketing salary seek', 'CMO salary australia'],
    relatedSlugs: ['digital-marketing-specialist', 'product-manager', 'ux-designer'],
  },
  {
    slug: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    industry: 'Marketing & Communications',
    description:
      'Digital Marketing Specialists manage paid ads, SEO, email and social media campaigns. This is one of the fastest-growing job categories on Seek in Australia, with strong demand from e-commerce and SaaS businesses seeking performance-focused marketers.',
    auMin: 60000, auMax: 100000, auMedian: 78000,
    nzMin: 55000, nzMax: 88000, nzMedian: 70000,
    levels: [
      { level: 'Junior Specialist',  auRange: '$55k – $72k', nzRange: 'NZD $50k – $65k'  },
      { level: 'Specialist',         auRange: '$72k – $95k', nzRange: 'NZD $65k – $85k'  },
      { level: 'Senior Specialist',  auRange: '$95k – $120k',nzRange: 'NZD $85k – $108k' },
    ],
    topEmployers: ['Canva', 'Redbubble', 'Kogan', 'Booktopia', 'Squarespace', 'HubSpot'],
    keywords: ['digital marketing salary australia', 'digital marketer salary seek', 'SEO specialist salary australia', 'Google Ads salary australia'],
    relatedSlugs: ['marketing-manager', 'ux-designer', 'product-manager'],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getRoleBySlug(slug: string): RoleSalaryData | undefined {
  return ROLES.find(r => r.slug === slug)
}

export function getAllSlugs(): string[] {
  return ROLES.map(r => r.slug)
}
