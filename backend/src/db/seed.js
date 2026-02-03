import db from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

console.log('Seeding Board Room database...\n');

// Clear existing data
db.exec(`
  DELETE FROM messages;
  DELETE FROM metrics;
  DELETE FROM decisions;
  DELETE FROM todos;
  DELETE FROM issues;
  DELETE FROM rocks;
  DELETE FROM meetings;
  DELETE FROM departments;
  DELETE FROM companies;
`);

// =============================================================================
// COMPANY
// =============================================================================
const companyId = uuidv4();
const company = {
  id: companyId,
  name: 'Career Capital',
  vision: 'The go-to resource for professionals who think long-term about their careers.',
  ten_year_target: 'The leading career development newsletter with 500K+ subscribers, a thriving community, premium products, and a reputation as the most trusted voice in long-term career strategy.',
  three_year_picture: `By end of year 3:
- 50,000+ subscribers
- $500K annual revenue from sponsors, affiliates, and digital products
- Published 150+ issues with a consistent, recognized voice
- Active community of engaged professionals
- Expanded to LinkedIn, podcast, and premium tier
- Known as the "long game" career newsletter`,
  one_year_plan: `This year we will:
- Grow from 0 to 5,000 subscribers
- Publish 52 weekly issues without missing a week
- Establish a consistent voice and format
- Launch LinkedIn presence with 3 posts/week
- Implement first affiliate integrations (books, tools)
- Identify and pitch 10 potential sponsors
- Build a 6-week content runway
- Set up basic P&L tracking`,
  core_values: JSON.stringify([
    { name: 'Substance Over Hacks', description: 'We provide real, lasting career advice — not clickbait tricks or quick fixes.' },
    { name: 'Curiosity', description: 'We explore, question, and dig deeper. We\'re learning alongside our readers.' },
    { name: 'Long-Term Thinking', description: 'Everything we do compounds. We play the long game in content, growth, and trust.' },
    { name: 'Honesty', description: 'We\'re direct about tradeoffs, nuance, and what we don\'t know. No hype.' }
  ])
};

db.prepare(`
  INSERT INTO companies (id, name, vision, ten_year_target, three_year_picture, one_year_plan, core_values)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(company.id, company.name, company.vision, company.ten_year_target, company.three_year_picture, company.one_year_plan, company.core_values);

console.log('Created company: Career Capital');

// =============================================================================
// DEPARTMENTS
// =============================================================================
const departments = [
  {
    id: uuidv4(),
    name: 'Editorial',
    agent_name: 'Editorial Director',
    avatar_color: '#3B82F6',
    responsibilities: 'Content calendar and publishing schedule. Editorial quality and voice consistency. Issue themes and angles. Final review of all content before it goes to CEO. Coordination with Research Analyst for source material.',
    agent_system_prompt: `ROLE: Editorial Director
COMPANY: Career Capital
REPORTS TO: CEO

YOU ARE:
The voice and quality gatekeeper of Career Capital. You think like a reader-first editor — every issue must be worth someone's time. You balance consistency with freshness, always asking "is this genuinely useful?" You care deeply about the long-term arc of the newsletter, not just filling a publishing calendar.

Career Capital is a weekly newsletter about building the skills, relationships, and reputation that make your career more valuable over time. The voice is thoughtful, curious, strategic but accessible, honest about tradeoffs, and respects the reader's intelligence.

YOU OWN:
- Content calendar and publishing schedule
- Editorial quality and voice consistency
- Issue themes and angles
- Final review of all content before it goes to CEO
- Coordination with Research Analyst for source material

YOUR METRICS:
- Open rate (target: 45%+)
- Click rate (target: 8%+)
- Reply rate (qualitative engagement)
- Publishing consistency (1 issue/week, on time)

HOW YOU COMMUNICATE:
- Thoughtful and clear, never rushed
- When presenting content plans, explain the "why" behind the angle
- Flag quality concerns directly — don't ship mediocre work
- When you need a decision, give a recommendation

CONTEXT YOU HAVE ACCESS TO:
- Content calendar
- Past issue performance data
- Research Analyst briefs
- Decision log

WHEN YOU REPORT:
- Weekly report every Tuesday
- Requests as needed when decisions are required before publishing`
  },
  {
    id: uuidv4(),
    name: 'Research',
    agent_name: 'Research Analyst',
    avatar_color: '#8B5CF6',
    responsibilities: 'Trend and topic research. Sourcing data, studies, and examples. Monitoring relevant communities (Reddit, LinkedIn, Twitter, HN). Competitive content analysis. Building the idea bank for future issues.',
    agent_system_prompt: `ROLE: Research Analyst
COMPANY: Career Capital
REPORTS TO: CEO

YOU ARE:
The curiosity engine of Career Capital. You're constantly scanning for ideas worth exploring — trends, studies, data, stories, frameworks, interesting people. You think like an investigative journalist mixed with a strategist. You don't just find things; you connect dots and surface what matters.

Career Capital is a weekly newsletter about building the skills, relationships, and reputation that make your career more valuable over time.

YOU OWN:
- Trend and topic research
- Sourcing data, studies, and examples
- Monitoring relevant communities (Reddit, LinkedIn, Twitter, HN)
- Competitive content analysis
- Building the "idea bank" for future issues

YOUR METRICS:
- Ideas surfaced per week (target: 5+)
- Ideas used in published content (target: 2+/month)
- Source quality score (self-assessed, 1-5)

HOW YOU COMMUNICATE:
- Concise and organized — bullet points are fine for research briefs
- Always include sources and links
- Highlight what's interesting, not just what exists
- When uncertain, say so — flag confidence level

CONTEXT YOU HAVE ACCESS TO:
- Research log
- Past issue topics (to avoid repetition)
- Decision log

WHEN YOU REPORT:
- Weekly research brief every Monday
- Alerts when something timely or urgent surfaces`
  },
  {
    id: uuidv4(),
    name: 'Growth',
    agent_name: 'Growth Manager',
    avatar_color: '#10B981',
    responsibilities: 'Subscriber growth strategy. Social media presence (LinkedIn, Twitter). Cross-promotion and collaboration opportunities. Referral and word-of-mouth programs. Growth experiments and tracking.',
    agent_system_prompt: `ROLE: Growth Manager
COMPANY: Career Capital
REPORTS TO: CEO

YOU ARE:
The engine for audience growth. You think in systems and experiments — what channels, what tactics, what messages will get Career Capital in front of more of the right people. You're data-informed but not data-paralyzed. You bias toward action and iteration.

Career Capital is a weekly newsletter about building the skills, relationships, and reputation that make your career more valuable over time.

YOU OWN:
- Subscriber growth strategy
- Social media presence (LinkedIn, Twitter)
- Cross-promotion and collaboration opportunities
- Referral and word-of-mouth programs
- Growth experiments and tracking

YOUR METRICS:
- Subscriber count (weekly tracking)
- Week-over-week growth rate (target: 5%+)
- Social followers and engagement
- Referral signups

HOW YOU COMMUNICATE:
- Direct and action-oriented
- Back recommendations with reasoning, even if brief
- Report on experiments: what you tried, what happened, what's next
- Proactively surface opportunities

CONTEXT YOU HAVE ACCESS TO:
- Subscriber metrics (Beehiiv)
- Social analytics
- Competitor growth tactics
- Decision log

WHEN YOU REPORT:
- Weekly report every Monday
- Requests when budget or partnership decisions needed`
  },
  {
    id: uuidv4(),
    name: 'Monetization',
    agent_name: 'Monetization Manager',
    avatar_color: '#F59E0B',
    responsibilities: 'Revenue strategy and roadmap. Sponsor identification and outreach. Affiliate program selection and integration. Digital product opportunities. Pricing and packaging decisions.',
    agent_system_prompt: `ROLE: Monetization Manager
COMPANY: Career Capital
REPORTS TO: CEO

YOU ARE:
The revenue strategist. You think about how Career Capital makes money without compromising reader trust. You're patient — you know monetization comes after value — but you're always laying groundwork. You identify opportunities, build relationships, and optimize what's working.

Career Capital is a weekly newsletter about building the skills, relationships, and reputation that make your career more valuable over time.

YOU OWN:
- Revenue strategy and roadmap
- Sponsor identification and outreach
- Affiliate program selection and integration
- Digital product opportunities
- Pricing and packaging decisions

YOUR METRICS:
- Monthly revenue
- Revenue per subscriber
- Sponsor pipeline (leads, conversations, closed)
- Affiliate conversion rates

HOW YOU COMMUNICATE:
- Strategic and business-minded
- When pitching opportunities, include revenue potential and risks
- Be direct about tradeoffs between revenue and reader experience
- Monthly cadence is fine unless something urgent

CONTEXT YOU HAVE ACCESS TO:
- Revenue data
- Subscriber demographics
- Sponsor research
- Decision log

WHEN YOU REPORT:
- Monthly report on the 1st
- Requests when sponsor or affiliate decisions needed`
  },
  {
    id: uuidv4(),
    name: 'Finance',
    agent_name: 'Finance Manager',
    avatar_color: '#EC4899',
    responsibilities: 'P&L tracking. Cost management. Revenue recording. Cash flow and runway visibility. Financial reporting.',
    agent_system_prompt: `ROLE: Finance Manager
COMPANY: Career Capital
REPORTS TO: CEO

YOU ARE:
The financial clarity provider. You keep the numbers simple and visible. For a lean operation like Career Capital, this means tracking costs, revenue, and runway — nothing fancy, but always accurate. You flag risks before they become problems.

Career Capital is a weekly newsletter about building the skills, relationships, and reputation that make your career more valuable over time.

YOU OWN:
- P&L tracking
- Cost management
- Revenue recording
- Cash flow and runway visibility
- Financial reporting

YOUR METRICS:
- Monthly revenue
- Monthly costs
- Net profit/loss
- Runway (months of operation at current burn)

HOW YOU COMMUNICATE:
- Clear and precise — numbers should be easy to understand
- Highlight what changed and why
- Flag anything unusual or concerning
- Keep it brief unless asked to go deeper

CONTEXT YOU HAVE ACCESS TO:
- Financial tracking sheet
- Revenue data from Monetization Manager
- Cost receipts and invoices
- Decision log

WHEN YOU REPORT:
- Monthly report on the 1st
- Alerts if cash flow issues or unexpected costs arise`
  }
];

const insertDept = db.prepare(`
  INSERT INTO departments (id, company_id, name, agent_name, avatar_color, responsibilities, agent_system_prompt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const dept of departments) {
  insertDept.run(dept.id, companyId, dept.name, dept.agent_name, dept.avatar_color, dept.responsibilities, dept.agent_system_prompt);
}

console.log(`Created ${departments.length} departments`);

// =============================================================================
// ROCKS (Quarterly Goals)
// =============================================================================
const currentQuarter = (() => {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
})();

const rocks = [
  // Editorial Rocks
  { department_id: departments[0].id, title: 'Establish consistent voice and format across first 12 issues', status: 'on_track', owner: 'Editorial Director' },
  { department_id: departments[0].id, title: 'Build a 6-week content runway in the calendar', status: 'on_track', owner: 'Editorial Director' },

  // Research Rocks
  { department_id: departments[1].id, title: 'Build a running database of 50+ career capital examples and case studies', status: 'on_track', owner: 'Research Analyst' },
  { department_id: departments[1].id, title: 'Establish weekly research rhythm and template', status: 'on_track', owner: 'Research Analyst' },

  // Growth Rocks
  { department_id: departments[2].id, title: 'Grow to 1,000 subscribers', status: 'on_track', owner: 'Growth Manager' },
  { department_id: departments[2].id, title: 'Establish consistent LinkedIn presence with 3 posts/week', status: 'off_track', owner: 'Growth Manager' },

  // Monetization Rocks
  { department_id: departments[3].id, title: 'Identify 10 potential sponsors aligned with audience', status: 'on_track', owner: 'Monetization Manager' },
  { department_id: departments[3].id, title: 'Implement first affiliate integration (books or tools)', status: 'on_track', owner: 'Monetization Manager' },

  // Finance Rocks
  { department_id: departments[4].id, title: 'Establish simple P&L tracking', status: 'on_track', owner: 'Finance Manager' },
  { department_id: departments[4].id, title: 'Create monthly finance report template', status: 'on_track', owner: 'Finance Manager' }
];

const insertRock = db.prepare(`
  INSERT INTO rocks (id, company_id, department_id, title, quarter, status, owner)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const rock of rocks) {
  insertRock.run(uuidv4(), companyId, rock.department_id, rock.title, currentQuarter, rock.status || 'on_track', rock.owner);
}

console.log(`Created ${rocks.length} rocks`);

// =============================================================================
// ISSUES
// =============================================================================
const issues = [
  { department_id: departments[0].id, title: 'Need to define consistent issue format and sections', priority: 1, description: 'Readers need to know what to expect each week. We should lock in a repeatable structure — intro hook, main insight, actionable takeaway, etc.' },
  { department_id: departments[1].id, title: 'Research sources are too broad — need focus areas', priority: 2, description: 'Scanning everything from Reddit to HN to LinkedIn is too wide. Should prioritize 3-4 core sources that consistently surface quality material.' },
  { department_id: departments[2].id, title: 'No referral program in place yet', priority: 2, description: 'Word-of-mouth is our best growth channel but we have no structured referral incentive. Beehiiv has built-in tools we haven\'t activated.' },
  { department_id: departments[2].id, title: 'LinkedIn content strategy undefined', priority: 1, description: 'We committed to 3 posts/week on LinkedIn but haven\'t defined what types of posts, what voice, or how they tie back to newsletter signups.' },
  { department_id: departments[3].id, title: 'Too early for sponsors — need credibility first', priority: 3, description: 'With under 1,000 subscribers, cold-pitching sponsors may hurt credibility. Should focus on affiliate revenue first and revisit sponsors at 5K+.' },
  { department_id: departments[4].id, title: 'No expense tracking system set up', priority: 2, description: 'Currently not tracking costs for tools (Beehiiv, domain, email, etc.). Need a simple spreadsheet or system before month-end.' }
];

const insertIssue = db.prepare(`
  INSERT INTO issues (id, company_id, department_id, surfaced_by, title, description, priority, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, 'open')
`);

for (const issue of issues) {
  insertIssue.run(uuidv4(), companyId, issue.department_id, issue.department_id, issue.title, issue.description, issue.priority);
}

console.log(`Created ${issues.length} issues`);

// =============================================================================
// TODOS
// =============================================================================
const todos = [
  { department_id: departments[0].id, title: 'Draft content calendar for next 6 weeks', due_date: getDateOffset(5) },
  { department_id: departments[0].id, title: 'Write Issue #1 draft and send to CEO for review', due_date: getDateOffset(3) },
  { department_id: departments[1].id, title: 'Compile initial list of 20 career capital examples/case studies', due_date: getDateOffset(7) },
  { department_id: departments[1].id, title: 'Set up monitoring for top 3 career subreddits and LinkedIn hashtags', due_date: getDateOffset(4) },
  { department_id: departments[2].id, title: 'Set up Beehiiv newsletter and configure analytics', due_date: getDateOffset(2) },
  { department_id: departments[2].id, title: 'Create LinkedIn profile for Career Capital', due_date: getDateOffset(3) },
  { department_id: departments[2].id, title: 'Draft first 5 LinkedIn posts to seed the account', due_date: getDateOffset(5) },
  { department_id: departments[3].id, title: 'Research 5 affiliate programs relevant to career professionals (books, courses, tools)', due_date: getDateOffset(7) },
  { department_id: departments[4].id, title: 'Create simple P&L spreadsheet with cost categories', due_date: getDateOffset(5) },
  { department_id: departments[4].id, title: 'Log all current tool subscriptions and monthly costs', due_date: getDateOffset(3) }
];

function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

const insertTodo = db.prepare(`
  INSERT INTO todos (id, company_id, department_id, title, due_date, status)
  VALUES (?, ?, ?, ?, ?, 'pending')
`);

for (const todo of todos) {
  insertTodo.run(uuidv4(), companyId, todo.department_id, todo.title, todo.due_date);
}

console.log(`Created ${todos.length} todos`);

// =============================================================================
// METRICS
// =============================================================================
const metrics = [
  // Editorial
  { department_id: departments[0].id, name: 'Open Rate', target: 45, current_value: 0, unit: '%', status: 'on_track' },
  { department_id: departments[0].id, name: 'Click Rate', target: 8, current_value: 0, unit: '%', status: 'on_track' },
  { department_id: departments[0].id, name: 'Issues Published', target: 1, current_value: 0, unit: '/week', status: 'on_track' },

  // Research
  { department_id: departments[1].id, name: 'Ideas Surfaced', target: 5, current_value: 0, unit: '/week', status: 'on_track' },
  { department_id: departments[1].id, name: 'Ideas Used in Content', target: 2, current_value: 0, unit: '/month', status: 'on_track' },

  // Growth
  { department_id: departments[2].id, name: 'Subscriber Count', target: 1000, current_value: 0, unit: '', status: 'on_track' },
  { department_id: departments[2].id, name: 'Week-over-Week Growth', target: 5, current_value: 0, unit: '%', status: 'on_track' },
  { department_id: departments[2].id, name: 'LinkedIn Followers', target: 500, current_value: 0, unit: '', status: 'on_track' },
  { department_id: departments[2].id, name: 'Referral Signups', target: 50, current_value: 0, unit: '/month', status: 'on_track' },

  // Monetization
  { department_id: departments[3].id, name: 'Monthly Revenue', target: 0, current_value: 0, unit: '$', status: 'on_track' },
  { department_id: departments[3].id, name: 'Revenue per Subscriber', target: 0, current_value: 0, unit: '$', status: 'on_track' },
  { department_id: departments[3].id, name: 'Sponsor Pipeline', target: 10, current_value: 0, unit: 'leads', status: 'on_track' },

  // Finance
  { department_id: departments[4].id, name: 'Monthly Revenue', target: 0, current_value: 0, unit: '$', status: 'on_track' },
  { department_id: departments[4].id, name: 'Monthly Costs', target: 50, current_value: 0, unit: '$', status: 'on_track' },
  { department_id: departments[4].id, name: 'Net Profit/Loss', target: 0, current_value: 0, unit: '$', status: 'on_track' },
  { department_id: departments[4].id, name: 'Runway', target: 12, current_value: 12, unit: 'months', status: 'on_track' }
];

const insertMetric = db.prepare(`
  INSERT INTO metrics (id, company_id, department_id, name, target, current_value, unit, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const metric of metrics) {
  insertMetric.run(uuidv4(), companyId, metric.department_id, metric.name, metric.target, metric.current_value, metric.unit, metric.status);
}

console.log(`Created ${metrics.length} metrics`);

// =============================================================================
// DECISIONS
// =============================================================================
const decisions = [
  {
    department_id: departments[0].id,
    context: 'Choosing newsletter voice and tone',
    decision: 'Thoughtful, curious, strategic but accessible. No jargon. Honest about tradeoffs. Respects reader intelligence.',
    rationale: 'Matches the "long game" brand — we\'re exploring alongside readers, not lecturing from above.'
  },
  {
    department_id: departments[2].id,
    context: 'Choosing newsletter platform',
    decision: 'Use Beehiiv for newsletter hosting and distribution',
    rationale: 'Free to start, good analytics, built-in growth tools (referral program, recommendations), scales well.'
  },
  {
    department_id: departments[0].id,
    context: 'Newsletter elevator pitch',
    decision: 'A weekly newsletter about building the skills, relationships, and reputation that make your career more valuable over time.',
    rationale: 'Clear, memorable, owns the "career capital" concept. Signals long-term thinking.'
  },
  {
    department_id: departments[3].id,
    context: 'Monetization phasing',
    decision: 'Phase 1 (0-1K subs): Free, focus on content and growth. Phase 2 (1K-5K): Affiliates and small digital products. Phase 3 (5K-10K): Approach sponsors. Phase 4 (10K+): Premium tier, own products, job board.',
    rationale: 'Monetization comes after value. Premature sponsor outreach hurts credibility.'
  }
];

const insertDecision = db.prepare(`
  INSERT INTO decisions (id, company_id, department_id, context, decision, rationale)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const decision of decisions) {
  insertDecision.run(uuidv4(), companyId, decision.department_id, decision.context, decision.decision, decision.rationale);
}

console.log(`Created ${decisions.length} decisions`);

// =============================================================================
// WELCOME MESSAGES
// =============================================================================
const welcomeMessages = [
  {
    department_id: departments[0].id,
    content: JSON.stringify({
      text: "Hello! I'm your Editorial Director. My job is to make sure every issue of Career Capital is worth the reader's time. I'll manage the content calendar, review drafts, and keep us on voice. Right now my top priority is defining a consistent format and building out our content runway. Ready to plan Issue #1 whenever you are."
    })
  },
  {
    department_id: departments[1].id,
    content: JSON.stringify({
      text: "Hi! I'm your Research Analyst — the curiosity engine behind Career Capital. I scan for trends, studies, data, stories, and frameworks in the career development space. I'll send you a weekly brief on what's interesting and worth exploring. Currently building out our initial database of career capital examples and case studies."
    })
  },
  {
    department_id: departments[2].id,
    content: JSON.stringify({
      text: "Hey! Growth Manager here. My focus is getting Career Capital in front of the right people. I'll track subscriber metrics, run growth experiments, manage our social presence, and find collaboration opportunities. First priorities: getting Beehiiv set up, launching our LinkedIn, and activating the referral program."
    })
  },
  {
    department_id: departments[3].id,
    content: JSON.stringify({
      text: "Hi — Monetization Manager here. I think about how Career Capital makes money without compromising reader trust. Right now we're in Phase 1 (free, focused on growth), but I'm already researching affiliate programs and building a list of potential sponsors for when we're ready. I'll keep the revenue roadmap clear."
    })
  },
  {
    department_id: departments[4].id,
    content: JSON.stringify({
      text: "Hello! I'm your Finance Manager. I keep the numbers simple and visible. For a lean newsletter operation, that means tracking costs, revenue, and runway. My immediate to-do: set up a basic P&L spreadsheet and log all our current tool costs. I'll flag anything concerning before it becomes a problem."
    })
  }
];

const insertMessage = db.prepare(`
  INSERT INTO messages (id, company_id, department_id, direction, type, content)
  VALUES (?, ?, ?, 'inbound', 'chat', ?)
`);

for (const msg of welcomeMessages) {
  insertMessage.run(uuidv4(), companyId, msg.department_id, msg.content);
}

console.log(`Created ${welcomeMessages.length} welcome messages`);

// =============================================================================
// DONE
// =============================================================================
console.log('\nDatabase seeded successfully!');
console.log(`
Summary:
- 1 company: Career Capital (weekly newsletter)
- ${departments.length} departments: Editorial, Research, Growth, Monetization, Finance
- ${rocks.length} rocks (quarterly goals)
- ${issues.length} open issues
- ${todos.length} pending todos
- ${metrics.length} scorecard metrics
- ${decisions.length} recorded decisions
- ${welcomeMessages.length} welcome messages

Run the app with:
  cd backend && npm run dev
  cd frontend && npm run dev
`);
