import { CompanyModel } from '../models/company.js';
import { DepartmentModel } from '../models/department.js';
import { RockModel } from '../models/rock.js';
import { IssueModel } from '../models/issue.js';
import { TodoModel } from '../models/todo.js';
import { DecisionModel } from '../models/decision.js';
import { MetricModel } from '../models/metric.js';
import { MessageModel } from '../models/message.js';

export function buildAgentContext(departmentId, companyId) {
  const department = DepartmentModel.findById(departmentId);
  if (!department) return null;

  const company = CompanyModel.findById(companyId);
  if (!company) return null;

  // Get department-specific data
  const rocks = RockModel.findAll({ department_id: departmentId });
  const issues = IssueModel.findAll({ department_id: departmentId, status: 'open' });
  const todos = TodoModel.findAll({ department_id: departmentId, status: 'pending' });
  const metrics = MetricModel.findAll({ department_id: departmentId });
  const recentDecisions = DecisionModel.findAll({ department_id: departmentId }).slice(0, 5);

  // Also get company-wide context
  const companyIssues = IssueModel.findAll({ company_id: companyId, status: 'open' }).slice(0, 10);
  const companyRocks = RockModel.findAll({ company_id: companyId }).slice(0, 10);

  // Parse company core values
  let coreValues = [];
  if (company.core_values) {
    try {
      coreValues = JSON.parse(company.core_values);
    } catch (e) {
      coreValues = [];
    }
  }

  return {
    department,
    company: {
      ...company,
      core_values: coreValues
    },
    departmentData: {
      rocks,
      issues,
      todos,
      metrics,
      recentDecisions
    },
    companyData: {
      issues: companyIssues,
      rocks: companyRocks
    }
  };
}

export function buildSystemPrompt(context) {
  const { department, company, departmentData, companyData } = context;

  let systemPrompt = department.agent_system_prompt || '';

  // Add company context
  systemPrompt += `\n\n## Company Context
Company: ${company.name}
${company.vision ? `Vision: ${company.vision}` : ''}
${company.ten_year_target ? `10-Year Target: ${company.ten_year_target}` : ''}
${company.three_year_picture ? `3-Year Picture: ${company.three_year_picture}` : ''}
${company.one_year_plan ? `1-Year Plan: ${company.one_year_plan}` : ''}
${company.core_values && company.core_values.length > 0 ? `Core Values: ${company.core_values.map(v => v.name || v).join(', ')}` : ''}
`;

  // Add department-specific context
  if (departmentData.rocks.length > 0) {
    systemPrompt += `\n## Your Department's Rocks (Quarterly Goals)
${departmentData.rocks.map(r => `- ${r.title} [${r.status}]`).join('\n')}
`;
  }

  if (departmentData.issues.length > 0) {
    systemPrompt += `\n## Open Issues in Your Department
${departmentData.issues.map(i => `- [P${i.priority}] ${i.title}`).join('\n')}
`;
  }

  if (departmentData.todos.length > 0) {
    systemPrompt += `\n## Pending To-Dos
${departmentData.todos.map(t => `- ${t.title}${t.due_date ? ` (due: ${t.due_date})` : ''}`).join('\n')}
`;
  }

  if (departmentData.metrics.length > 0) {
    systemPrompt += `\n## Your Metrics
${departmentData.metrics.map(m => `- ${m.name}: ${m.current_value || 'N/A'}/${m.target || 'N/A'} ${m.unit || ''} [${m.status}]`).join('\n')}
`;
  }

  if (departmentData.recentDecisions.length > 0) {
    systemPrompt += `\n## Recent Decisions
${departmentData.recentDecisions.map(d => `- ${d.decision}`).join('\n')}
`;
  }

  // Add company-wide awareness
  if (companyData.issues.length > 0) {
    systemPrompt += `\n## Company-Wide Issues
${companyData.issues.slice(0, 5).map(i => `- [P${i.priority}] ${i.title}${i.department_name ? ` (${i.department_name})` : ''}`).join('\n')}
`;
  }

  // Add behavioral guidelines
  systemPrompt += `\n## Behavioral Guidelines
- Be concise and professional in your responses
- When you identify a new issue, prefix it with "ISSUE:" so it can be automatically tracked
- When you suggest an action item, prefix it with "TODO:" so it can be automatically tracked
- Always consider how your department's work impacts other departments
- Proactively surface concerns and blockers
- Reference specific rocks, metrics, and decisions when relevant
`;

  return systemPrompt;
}

export function getConversationHistory(departmentId, limit = 20) {
  const messages = MessageModel.getConversation(departmentId, limit);

  return messages.map(m => {
    let content;
    try {
      const parsed = JSON.parse(m.content);
      content = parsed.text || JSON.stringify(parsed);
    } catch {
      content = m.content;
    }

    return {
      role: m.direction === 'outbound' ? 'user' : 'assistant',
      content
    };
  });
}

export const AgentContextService = {
  buildAgentContext,
  buildSystemPrompt,
  getConversationHistory
};
