import { MeetingModel } from '../models/meeting.js';
import { DepartmentModel } from '../models/department.js';
import { RockModel } from '../models/rock.js';
import { TodoModel } from '../models/todo.js';
import { IssueModel } from '../models/issue.js';
import { MetricModel } from '../models/metric.js';

const SECTIONS = ['segue', 'scorecard', 'rocks', 'headlines', 'todos', 'ids', 'conclude'];

export function getSectionData(meeting, companyId) {
  const section = meeting.current_section;

  switch (section) {
    case 'segue':
      return getSegueData(companyId);
    case 'scorecard':
      return getScorecardData(companyId);
    case 'rocks':
      return getRocksData(companyId);
    case 'headlines':
      return getHeadlinesData(companyId);
    case 'todos':
      return getTodosData(companyId);
    case 'ids':
      return getIDSData(companyId);
    case 'conclude':
      return getConcludeData(meeting, companyId);
    default:
      return {};
  }
}

function getSegueData(companyId) {
  const departments = DepartmentModel.findByCompany(companyId);
  return {
    departments: departments.map(d => ({
      id: d.id,
      name: d.name,
      agent_name: d.agent_name
    })),
    prompt: "Share one personal and one professional good news from the past week."
  };
}

function getScorecardData(companyId) {
  const scorecard = MetricModel.getScorecard(companyId);
  return {
    scorecard,
    offTrackMetrics: Object.values(scorecard.byDepartment)
      .flat()
      .filter(m => m.status !== 'on_track')
  };
}

function getRocksData(companyId) {
  const currentQuarter = getCurrentQuarter();
  const rocks = RockModel.findByCompany(companyId, currentQuarter);
  return {
    rocks,
    onTrack: rocks.filter(r => r.status === 'on_track'),
    offTrack: rocks.filter(r => r.status === 'off_track'),
    completed: rocks.filter(r => r.status === 'completed')
  };
}

function getHeadlinesData(companyId) {
  const departments = DepartmentModel.findByCompany(companyId);
  return {
    departments: departments.map(d => ({
      id: d.id,
      name: d.name,
      agent_name: d.agent_name
    })),
    prompt: "Share any important customer or employee news, wins, or updates."
  };
}

function getTodosData(companyId) {
  const todos = TodoModel.findByCompany(companyId, true);
  const pending = todos.filter(t => t.status === 'pending');
  const completed = todos.filter(t => t.status === 'completed');

  // Get last week's todos
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekTodos = todos.filter(t => new Date(t.created_at) >= lastWeek);

  return {
    pending,
    completed,
    lastWeekTodos,
    completionRate: todos.length > 0
      ? Math.round((completed.length / todos.length) * 100)
      : 100
  };
}

function getIDSData(companyId) {
  const issues = IssueModel.findByCompany(companyId, false);
  return {
    issues: issues.sort((a, b) => a.priority - b.priority),
    byPriority: {
      high: issues.filter(i => i.priority === 1),
      medium: issues.filter(i => i.priority === 2),
      low: issues.filter(i => i.priority === 3)
    }
  };
}

function getConcludeData(meeting, companyId) {
  // Summarize what happened in the meeting
  const summary = meeting.summary ? JSON.parse(meeting.summary) : {};

  // Get items created during meeting
  const meetingStart = meeting.started_at;
  const todosCreated = TodoModel.findAll({ company_id: companyId })
    .filter(t => new Date(t.created_at) >= new Date(meetingStart));
  const issuesResolved = IssueModel.findAll({ company_id: companyId, status: 'solved' })
    .filter(i => new Date(i.updated_at) >= new Date(meetingStart));

  return {
    ...summary,
    todosCreated,
    issuesResolved,
    duration: meeting.started_at
      ? Math.round((Date.now() - new Date(meeting.started_at).getTime()) / 60000)
      : 0
  };
}

function getCurrentQuarter() {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
}

export function createL10Meeting(companyId, attendees = []) {
  return MeetingModel.create({
    company_id: companyId,
    type: 'l10',
    status: 'scheduled',
    attendees
  });
}

export function startL10Meeting(meetingId) {
  return MeetingModel.start(meetingId);
}

export function advanceSection(meetingId) {
  return MeetingModel.nextSection(meetingId);
}

export function goBackSection(meetingId) {
  return MeetingModel.previousSection(meetingId);
}

export function jumpToSection(meetingId, section) {
  if (!SECTIONS.includes(section)) {
    throw new Error(`Invalid section: ${section}`);
  }
  return MeetingModel.goToSection(meetingId, section);
}

export function completeL10Meeting(meetingId, rating = null) {
  const meeting = MeetingModel.findById(meetingId);
  if (!meeting) return null;

  const companyId = meeting.company_id;
  const meetingStart = meeting.started_at;

  // Build summary
  const summary = {
    duration: meetingStart
      ? Math.round((Date.now() - new Date(meetingStart).getTime()) / 60000)
      : 0,
    rating,
    todosCreated: TodoModel.findAll({ company_id: companyId })
      .filter(t => new Date(t.created_at) >= new Date(meetingStart)).length,
    issuesResolved: IssueModel.findAll({ company_id: companyId, status: 'solved' })
      .filter(i => new Date(i.updated_at) >= new Date(meetingStart)).length
  };

  return MeetingModel.complete(meetingId, summary);
}

export const L10MeetingService = {
  getSectionData,
  createL10Meeting,
  startL10Meeting,
  advanceSection,
  goBackSection,
  jumpToSection,
  completeL10Meeting,
  SECTIONS
};
