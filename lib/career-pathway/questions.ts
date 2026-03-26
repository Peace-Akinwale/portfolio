// lib/career-pathway/questions.ts
import type { Question } from './types';

export const QUESTIONS: Question[] = [
  // ─── Phase 1: Who You Are ───────────────────────────────────────────────────
  {
    id: 'A1',
    phase: 'Who You Are',
    text: 'People who know you well would say you\'re...',
    type: 'multi',
    maxSelections: 2,
    options: [
      { value: 'explainer', label: 'Good at explaining things' },
      { value: 'analytical', label: 'Logical and analytical' },
      { value: 'creative', label: 'Creative and visual' },
      { value: 'organised', label: 'Organised and detail-oriented' },
      { value: 'tech-quick', label: 'Quick with technology' },
      { value: 'people-reader', label: 'Good at reading people' },
    ],
  },
  {
    id: 'A2',
    phase: 'Who You Are',
    text: 'Which school subjects did you actually enjoy?',
    type: 'multi',
    options: [
      { value: 'maths-sciences', label: 'Maths or Sciences' },
      { value: 'english-languages', label: 'English or Languages' },
      { value: 'art-design', label: 'Art or Design' },
      { value: 'business-economics', label: 'Business or Economics' },
      { value: 'tech-cs', label: 'Tech or Computer studies' },
      { value: 'none', label: "None — school wasn't my thing" },
    ],
  },
  {
    id: 'A3',
    phase: 'Who You Are',
    text: 'Which of these do you believe you could get good at, even if you haven\'t tried yet?',
    type: 'multi',
    maxSelections: 2,
    options: [
      { value: 'writing-paid', label: 'Writing clearly enough that people pay for it' },
      { value: 'build-website-app', label: 'Building a website or app' },
      { value: 'data-sense', label: 'Making sense of messy data' },
      { value: 'design-pro', label: 'Designing something professional-looking' },
      { value: 'project-track', label: 'Keeping a chaotic project on track' },
      { value: 'explain-technical', label: 'Explaining technical things so anyone understands' },
    ],
  },
  {
    id: 'A4',
    phase: 'Who You Are',
    text: 'How much does your family situation shape your career choice?',
    type: 'single',
    options: [
      { value: 'high-pressure', label: 'A lot — I need to earn for my family, not just myself' },
      { value: 'some-pressure', label: "Somewhat — there's pressure but I have some freedom" },
      { value: 'low-pressure', label: "Not much — I'm mostly deciding for myself" },
      { value: 'supported', label: 'My family supports whatever I choose' },
    ],
  },

  // ─── Phase 2: What Appeals to You ──────────────────────────────────────────
  {
    id: 'B1',
    phase: 'What Appeals to You',
    text: 'Which of these problems would you find most interesting to solve?',
    type: 'single',
    options: [
      { value: 'technical', label: 'Why is this website breaking?' },
      { value: 'content-strategy', label: "Why isn't this article converting readers into customers?" },
      { value: 'design-ux', label: 'Why does this app confuse everyone who uses it?' },
      { value: 'data-analysis', label: 'Why is this data telling two different stories?' },
      { value: 'project-mgmt', label: 'Why does this team keep missing deadlines?' },
      { value: 'docs-devrel', label: "Why can't people figure out how to use, trust, or adopt this product?" },
    ],
  },
  {
    id: 'B2',
    phase: 'What Appeals to You',
    text: 'When you imagine your ideal work day, which sounds better?',
    type: 'single',
    options: [
      { value: 'building', label: 'Spending most of the day building or fixing something on a screen' },
      { value: 'creating', label: 'Spending most of the day creating content, visuals, or narratives' },
      { value: 'analysing', label: 'Spending most of the day researching, analysing, or making sense of information' },
      { value: 'coordinating', label: 'Spending most of the day coordinating with people, solving team problems, or communicating ideas' },
    ],
  },

  // ─── Conditional questions ──────────────────────────────────────────────────
  {
    id: 'B_TECH',
    phase: 'What Appeals to You',
    text: 'What part of building tech interests you more?',
    type: 'single',
    conditional: { dependsOn: 'B1', showWhen: 'technical' },
    options: [
      { value: 'frontend', label: 'What users see and click on' },
      { value: 'backend', label: 'The systems running behind the scenes' },
      { value: 'devops', label: 'Making sure everything runs and stays up' },
      { value: 'cybersecurity', label: 'Keeping systems safe from attacks' },
      { value: 'fullstack', label: 'A bit of everything' },
    ],
  },
  {
    id: 'B_CONTENT',
    phase: 'What Appeals to You',
    text: 'What kind of writing sounds more like you?',
    type: 'single',
    conditional: { dependsOn: 'B1', showWhen: 'content-strategy' },
    options: [
      { value: 'tech-writing', label: 'Writing that teaches people how to use a product' },
      { value: 'b2b-saas', label: 'Writing that convinces businesses to buy something' },
      { value: 'seo-content', label: 'Writing that gets found on Google and drives traffic' },
      { value: 'dev-docs', label: 'Writing technical explainers, tutorials, or product education content' },
    ],
  },
  {
    id: 'B_DESIGN',
    phase: 'What Appeals to You',
    text: 'What appeals to you more about design?',
    type: 'single',
    conditional: { dependsOn: 'B1', showWhen: 'design-ux' },
    options: [
      { value: 'ui-design', label: 'Making things look beautiful and polished' },
      { value: 'ux-design', label: 'Making things easy and intuitive to use' },
      { value: 'product-design', label: 'Understanding the business problem and designing the right product' },
    ],
  },
  {
    id: 'B_DATA',
    phase: 'What Appeals to You',
    text: 'What sounds more interesting?',
    type: 'single',
    conditional: { dependsOn: 'B1', showWhen: 'data-analysis' },
    options: [
      { value: 'data-analyst', label: 'Finding insights in data and helping people make decisions' },
      { value: 'data-engineer', label: 'Building the systems that collect, move, and process data' },
    ],
  },
  {
    id: 'B_PM',
    phase: 'What Appeals to You',
    text: 'Would you rather...',
    type: 'single',
    conditional: { dependsOn: 'B1', showWhen: 'project-mgmt' },
    options: [
      { value: 'product-manager', label: 'Own the vision for what gets built and why' },
      { value: 'project-manager', label: 'Keep the team on track and make sure things ship on time' },
    ],
  },
  {
    id: 'B_DEVREL',
    phase: 'What Appeals to You',
    text: 'What kind of communication work sounds most like you?',
    type: 'single',
    conditional: { dependsOn: 'B1', showWhen: 'docs-devrel' },
    options: [
      { value: 'dev-docs', label: 'Technical docs, tutorials, or product education' },
      { value: 'ux-writer', label: 'Product messaging, onboarding, or usability guidance' },
      { value: 'b2b-content', label: 'Thought leadership, case studies, or buyer education' },
    ],
  },

  // ─── Phase 3: Your Situation ────────────────────────────────────────────────
  {
    id: 'C1',
    phase: 'Your Situation',
    text: 'How soon do you need to start earning from a new skill?',
    type: 'single',
    options: [
      { value: 'urgent', label: 'As soon as possible — 3 to 6 months' },
      { value: 'within-year', label: 'Within a year is okay' },
      { value: 'one-two-years', label: 'I can invest 1–2 years before earning' },
      { value: 'no-rush', label: 'No rush right now' },
    ],
  },
  {
    id: 'C2',
    phase: 'Your Situation',
    text: "What's your current education situation?",
    type: 'single',
    options: [
      { value: 'secondary', label: 'Still in secondary school' },
      { value: 'some-uni', label: "Some university, haven't finished" },
      { value: 'degree', label: 'Completed a degree (any field)' },
      { value: 'vocational', label: 'Completed a technical or vocational programme' },
      { value: 'no-formal', label: 'No formal education past school' },
    ],
  },
  {
    id: 'C3',
    phase: 'Your Situation',
    text: 'How many hours a week can you realistically give to learning?',
    type: 'single',
    options: [
      { value: 'under5', label: 'Under 5 — I have major commitments' },
      { value: '5to15', label: '5–15 — learning on the side' },
      { value: '15to30', label: '15–30 — part-time focus' },
      { value: '30plus', label: 'I can go all in' },
    ],
  },
  {
    id: 'C4',
    phase: 'Your Situation',
    text: "What's your budget for learning each month?",
    type: 'single',
    options: [
      { value: 'zero', label: 'Zero — everything must be free' },
      { value: 'under20', label: 'Up to $20' },
      { value: '20to100', label: '$20–$100' },
      { value: 'over100', label: 'Over $100' },
    ],
  },
  {
    id: 'C5',
    phase: 'Your Situation',
    text: 'Some technical roles (like cybersecurity or cloud engineering) require paid certification exams ($300–$500) to get hired. Writing and design roles typically don\'t. Could you save up for one if your best-fit career needed it?',
    type: 'single',
    options: [
      { value: 'cert-yes', label: 'Yes, I could manage that' },
      { value: 'cert-maybe', label: 'Maybe, with enough time to save' },
      { value: 'cert-no', label: "That's not realistic for me" },
    ],
  },

  // ─── Phase 4: Your Setup ────────────────────────────────────────────────────
  {
    id: 'D1',
    phase: 'Your Setup',
    text: 'How reliable is your internet?',
    type: 'single',
    options: [
      { value: 'solid', label: 'Solid — video calls and streaming work fine' },
      { value: 'mostly-ok', label: 'Mostly okay, sometimes unreliable' },
      { value: 'limited', label: 'Often slow or limited' },
    ],
  },
  {
    id: 'D2',
    phase: 'Your Setup',
    text: 'Could you do work online for people or companies outside your city or country?',
    type: 'single',
    options: [
      { value: 'remote-yes', label: "Yes — I have stable internet and I'm comfortable working with people remotely" },
      { value: 'remote-maybe', label: "I think so, but I've never done it before" },
      { value: 'local-pref', label: "I'd prefer to find work locally" },
      { value: 'remote-no', label: 'My internet situation makes remote work difficult' },
    ],
  },

  // ─── Phase 5: What You Value ────────────────────────────────────────────────
  {
    id: 'E1',
    phase: 'What You Value',
    text: 'What matters most to you in a career?',
    type: 'multi',
    maxSelections: 2,
    options: [
      { value: 'earning-well', label: 'Earning well' },
      { value: 'creative-freedom', label: 'Creative freedom' },
      { value: 'stability', label: 'Stability and security' },
      { value: 'remote-work', label: 'Working from anywhere' },
      { value: 'visible-impact', label: 'Making a visible impact' },
      { value: 'clear-growth', label: 'A clear path to grow' },
    ],
  },
  {
    id: 'E2',
    phase: 'What You Value',
    text: 'How do you feel about AI being part of your work?',
    type: 'single',
    options: [
      { value: 'lean-into-ai', label: 'I want to lean into it heavily — it makes me faster' },
      { value: 'ai-as-tool', label: 'Fine as a tool, but my core skill should be human' },
      { value: 'human-central', label: 'I\'d prefer a field where human judgment stays central' },
      { value: 'ai-neutral', label: "Haven't thought about it" },
    ],
  },
];

export function getConditionalQuestion(b1Answer: string): Question | null {
  const conditionalMap: Record<string, string> = {
    technical: 'B_TECH',
    'content-strategy': 'B_CONTENT',
    'design-ux': 'B_DESIGN',
    'data-analysis': 'B_DATA',
    'project-mgmt': 'B_PM',
    'docs-devrel': 'B_DEVREL',
  };
  const questionId = conditionalMap[b1Answer];
  if (!questionId) return null;
  return QUESTIONS.find((q) => q.id === questionId) ?? null;
}

export function buildQuestionSequence(answers: Record<string, string | string[]>): Question[] {
  const universalIds = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'C5', 'D1', 'D2', 'E1', 'E2'];
  const universal = universalIds.map((id) => QUESTIONS.find((q) => q.id === id)!);

  const b1Answer = answers['B1'] as string | undefined;
  const conditional = b1Answer ? getConditionalQuestion(b1Answer) : null;

  if (conditional) {
    const insertAfter = universal.findIndex((q) => q.id === 'B2');
    return [
      ...universal.slice(0, insertAfter + 1),
      conditional,
      ...universal.slice(insertAfter + 1),
    ];
  }
  return universal;
}
