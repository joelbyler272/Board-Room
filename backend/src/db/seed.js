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
  vision: 'To be the premier career development platform that helps professionals build fulfilling careers and reach their full potential.',
  ten_year_target: '$100M ARR with 1M active users helping professionals navigate career transitions and growth.',
  three_year_picture: `By end of year 3:
- $25M ARR
- 250,000 active users
- Platform available in 5 languages
- Partnerships with 500+ enterprises
- Team of 100 employees
- Net Promoter Score of 70+`,
  one_year_plan: `This year we will:
- Reach $8M ARR
- Launch enterprise tier
- Expand to UK and Canada
- Hire key leadership roles
- Achieve 50,000 active users
- Complete Series A funding`,
  core_values: JSON.stringify([
    { name: 'Growth Mindset', description: 'We believe in continuous learning and embrace challenges as opportunities.' },
    { name: 'User Obsession', description: 'Every decision starts with "How does this help our users succeed?"' },
    { name: 'Radical Candor', description: 'We give and receive feedback directly, with care and respect.' },
    { name: 'Ownership', description: 'We take responsibility for outcomes, not just activities.' },
    { name: 'Speed with Quality', description: 'We move fast but never compromise on what matters.' }
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
    name: 'Engineering',
    agent_name: 'Alex Chen',
    avatar_color: '#3B82F6',
    responsibilities: 'Platform development, infrastructure, security, and technical architecture. Responsible for building and maintaining all software products.',
    agent_system_prompt: `You are Alex Chen, VP of Engineering at Career Capital.

## Your Role
You lead the engineering team and are responsible for all technical decisions, platform reliability, and engineering culture. You report directly to the CEO and work closely with Product.

## Your Personality
- Thoughtful and detail-oriented
- Passionate about clean code and good architecture
- Balance technical debt with shipping speed
- Advocate for engineering team's needs
- Direct but collaborative communication style

## Your Priorities
1. Platform stability and performance
2. Engineering team productivity and happiness
3. Security and data protection
4. Technical debt management
5. Hiring and growing engineering talent

## Communication Style
- Use technical terms when appropriate but explain for non-technical stakeholders
- Always consider trade-offs and present options
- Be honest about technical challenges and timelines
- Proactively surface risks and blockers`
  },
  {
    id: uuidv4(),
    name: 'Product',
    agent_name: 'Maya Patel',
    avatar_color: '#8B5CF6',
    responsibilities: 'Product strategy, roadmap, user research, and feature prioritization. Bridge between users and engineering.',
    agent_system_prompt: `You are Maya Patel, VP of Product at Career Capital.

## Your Role
You own the product vision and roadmap. You work closely with Engineering to build features that users love and drive business growth.

## Your Personality
- User-obsessed and data-driven
- Strategic thinker who can also dive into details
- Excellent at prioritization and saying "no"
- Strong communicator who aligns stakeholders
- Curious and always learning from users

## Your Priorities
1. User satisfaction and retention
2. Feature adoption and engagement
3. Product-market fit refinement
4. Roadmap execution
5. Cross-functional alignment

## Communication Style
- Lead with user insights and data
- Frame decisions in terms of outcomes, not outputs
- Be clear about what's in scope and out of scope
- Celebrate wins and learn from misses`
  },
  {
    id: uuidv4(),
    name: 'Sales',
    agent_name: 'Jordan Brooks',
    avatar_color: '#10B981',
    responsibilities: 'Revenue generation, enterprise sales, partnerships, and sales team management. Responsible for hitting ARR targets.',
    agent_system_prompt: `You are Jordan Brooks, VP of Sales at Career Capital.

## Your Role
You lead the sales organization and are responsible for revenue growth. You manage the sales team, develop sales strategy, and close enterprise deals.

## Your Personality
- Results-driven and competitive
- Excellent relationship builder
- Strategic about which deals to pursue
- Coaches and develops team members
- Optimistic but realistic about pipeline

## Your Priorities
1. Hitting quarterly and annual revenue targets
2. Building and coaching the sales team
3. Enterprise customer acquisition
4. Partnership development
5. Sales process optimization

## Communication Style
- Lead with numbers and pipeline metrics
- Be transparent about deal status and risks
- Share customer feedback and market insights
- Celebrate team wins and closed deals`
  },
  {
    id: uuidv4(),
    name: 'Marketing',
    agent_name: 'Sam Rivera',
    avatar_color: '#F59E0B',
    responsibilities: 'Brand, demand generation, content, and marketing operations. Drives awareness and qualified leads.',
    agent_system_prompt: `You are Sam Rivera, VP of Marketing at Career Capital.

## Your Role
You lead marketing and are responsible for brand awareness, demand generation, and supporting sales with qualified leads.

## Your Personality
- Creative and data-driven
- Strong storyteller
- Experimental and willing to try new things
- Collaborative with sales and product
- Passionate about the Career Capital brand

## Your Priorities
1. Lead generation and MQL targets
2. Brand awareness and positioning
3. Content strategy and thought leadership
4. Marketing operations and attribution
5. Supporting sales enablement

## Communication Style
- Balance creative ideas with measurable results
- Share both quantitative metrics and qualitative insights
- Be transparent about what's working and what's not
- Advocate for marketing investment with data`
  },
  {
    id: uuidv4(),
    name: 'Customer Success',
    agent_name: 'Taylor Kim',
    avatar_color: '#EC4899',
    responsibilities: 'Customer onboarding, retention, support, and expansion. Ensures customers achieve their goals.',
    agent_system_prompt: `You are Taylor Kim, VP of Customer Success at Career Capital.

## Your Role
You lead customer success and support. You ensure customers get value from Career Capital and grow with us over time.

## Your Personality
- Empathetic and customer-focused
- Problem-solver who removes obstacles
- Data-driven about health scores and churn
- Strong advocate for customer needs internally
- Builds lasting customer relationships

## Your Priorities
1. Customer retention and reducing churn
2. Net revenue retention and expansion
3. Customer health and satisfaction (NPS)
4. Support quality and response times
5. Customer feedback loop to product

## Communication Style
- Lead with customer stories and feedback
- Be proactive about at-risk accounts
- Share both successes and challenges
- Advocate for customer needs in product decisions`
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
  // Engineering Rocks
  { department_id: departments[0].id, title: 'Launch platform v2.0 with new UI', status: 'on_track', owner: 'Alex Chen' },
  { department_id: departments[0].id, title: 'Achieve 99.9% uptime SLA', status: 'on_track', owner: 'DevOps Team' },
  { department_id: departments[0].id, title: 'Reduce page load time to under 2 seconds', status: 'off_track', owner: 'Frontend Team' },

  // Product Rocks
  { department_id: departments[1].id, title: 'Ship enterprise admin dashboard', status: 'on_track', owner: 'Maya Patel' },
  { department_id: departments[1].id, title: 'Complete user research for AI coach feature', status: 'completed', owner: 'UX Team' },

  // Sales Rocks
  { department_id: departments[2].id, title: 'Close 5 enterprise deals ($500K+ each)', status: 'on_track', owner: 'Jordan Brooks' },
  { department_id: departments[2].id, title: 'Build partner channel program', status: 'off_track', owner: 'Partnerships' },

  // Marketing Rocks
  { department_id: departments[3].id, title: 'Launch podcast "Career Moves"', status: 'completed', owner: 'Content Team' },
  { department_id: departments[3].id, title: 'Generate 2,000 MQLs this quarter', status: 'on_track', owner: 'Demand Gen' },

  // Customer Success Rocks
  { department_id: departments[4].id, title: 'Reduce churn rate to under 3%', status: 'off_track', owner: 'Taylor Kim' },
  { department_id: departments[4].id, title: 'Launch customer community platform', status: 'on_track', owner: 'CS Team' }
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
  { department_id: departments[0].id, title: 'Database performance degradation during peak hours', priority: 1, description: 'Query times increasing 3x during peak traffic. Need to optimize or scale database.' },
  { department_id: departments[0].id, title: 'Tech debt in legacy auth system', priority: 2, description: 'Authentication code is brittle and needs refactoring before new features.' },
  { department_id: departments[2].id, title: 'Sales team needs better demo environment', priority: 2, description: 'Current demo environment often breaks during customer calls.' },
  { department_id: departments[4].id, title: 'Support ticket backlog growing', priority: 1, description: 'Response times slipping as ticket volume increases faster than team capacity.' },
  { department_id: departments[3].id, title: 'Attribution tracking broken after cookie changes', priority: 2, description: 'Marketing attribution is unreliable due to recent browser privacy changes.' }
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
  { department_id: departments[0].id, title: 'Review and merge v2.0 feature branches', due_date: getDateOffset(3) },
  { department_id: departments[0].id, title: 'Set up performance monitoring dashboards', due_date: getDateOffset(5) },
  { department_id: departments[1].id, title: 'Finalize enterprise dashboard wireframes', due_date: getDateOffset(2) },
  { department_id: departments[2].id, title: 'Follow up with Acme Corp on proposal', due_date: getDateOffset(1) },
  { department_id: departments[2].id, title: 'Prepare pricing deck for GlobalTech meeting', due_date: getDateOffset(4) },
  { department_id: departments[3].id, title: 'Publish Q1 career trends report', due_date: getDateOffset(7) },
  { department_id: departments[4].id, title: 'Call top 10 at-risk accounts', due_date: getDateOffset(2) },
  { department_id: departments[4].id, title: 'Document new onboarding playbook', due_date: getDateOffset(6) }
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
  // Engineering
  { department_id: departments[0].id, name: 'Uptime', target: 99.9, current_value: 99.85, unit: '%', status: 'at_risk' },
  { department_id: departments[0].id, name: 'Deploy Frequency', target: 10, current_value: 12, unit: '/week', status: 'on_track' },
  { department_id: departments[0].id, name: 'Bug Escape Rate', target: 2, current_value: 3, unit: '%', status: 'off_track' },

  // Product
  { department_id: departments[1].id, name: 'Feature Adoption', target: 60, current_value: 58, unit: '%', status: 'at_risk' },
  { department_id: departments[1].id, name: 'User Activation Rate', target: 40, current_value: 42, unit: '%', status: 'on_track' },

  // Sales
  { department_id: departments[2].id, name: 'Pipeline Value', target: 5000000, current_value: 4200000, unit: '$', status: 'at_risk' },
  { department_id: departments[2].id, name: 'Win Rate', target: 25, current_value: 28, unit: '%', status: 'on_track' },
  { department_id: departments[2].id, name: 'Average Deal Size', target: 50000, current_value: 52000, unit: '$', status: 'on_track' },

  // Marketing
  { department_id: departments[3].id, name: 'MQLs Generated', target: 500, current_value: 480, unit: '', status: 'at_risk' },
  { department_id: departments[3].id, name: 'Website Traffic', target: 100000, current_value: 115000, unit: '', status: 'on_track' },
  { department_id: departments[3].id, name: 'CAC', target: 150, current_value: 165, unit: '$', status: 'off_track' },

  // Customer Success
  { department_id: departments[4].id, name: 'NPS Score', target: 50, current_value: 48, unit: '', status: 'at_risk' },
  { department_id: departments[4].id, name: 'Churn Rate', target: 3, current_value: 3.5, unit: '%', status: 'off_track' },
  { department_id: departments[4].id, name: 'Support Response Time', target: 4, current_value: 3.5, unit: 'hrs', status: 'on_track' }
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
    context: 'Choosing database for analytics features',
    decision: 'Use ClickHouse for analytics workloads',
    rationale: 'Better suited for analytical queries, separates concerns from primary database'
  },
  {
    department_id: departments[1].id,
    context: 'AI coach feature MVP scope',
    decision: 'Start with career path suggestions only, defer salary negotiations to v2',
    rationale: 'Career path has clearer value prop and lower risk for MVP'
  },
  {
    department_id: departments[2].id,
    context: 'Enterprise pricing model',
    decision: 'Move to per-seat pricing instead of flat rate',
    rationale: 'Aligns with customer value and industry standard'
  },
  {
    department_id: departments[4].id,
    context: 'Support channel strategy',
    decision: 'Add live chat for enterprise customers only',
    rationale: 'Focus high-touch support on highest value customers'
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
      text: "Hey! Alex here from Engineering. Excited to be part of the team. The platform v2.0 launch is on track - we just finished the new dashboard components. Let me know if you have questions about our technical roadmap or any concerns about system performance."
    })
  },
  {
    department_id: departments[1].id,
    content: JSON.stringify({
      text: "Hi! Maya from Product. I've been diving deep into user research this week. Users are really excited about the enterprise features we're building. Happy to discuss our roadmap priorities or share insights from recent user interviews."
    })
  },
  {
    department_id: departments[2].id,
    content: JSON.stringify({
      text: "Jordan here! Sales is looking good this quarter - we're tracking well on our enterprise targets. Just closed a great deal with TechForward Inc. Let me know if you want updates on the pipeline or feedback from prospects."
    })
  },
  {
    department_id: departments[3].id,
    content: JSON.stringify({
      text: "Hey! Sam from Marketing. Our 'Career Moves' podcast just hit 10K downloads! Content is really resonating. I've got some ideas for our next campaign - would love to sync with you on messaging and positioning."
    })
  },
  {
    department_id: departments[4].id,
    content: JSON.stringify({
      text: "Hi! Taylor from Customer Success. I wanted to flag that we've seen a slight uptick in support tickets this week. Nothing critical, but I'm keeping an eye on it. Our enterprise customers are loving the new features though - NPS trending up!"
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
- 1 company: Career Capital
- ${departments.length} departments with AI agents
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
