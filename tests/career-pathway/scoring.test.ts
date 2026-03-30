import { describe, expect, it } from 'vitest';
import { CAREERS } from '../../lib/career-pathway/careers';
import {
  applyRefinementBonuses,
  getTopScore,
  getResultConfidenceStyle,
  resolveWhyItFits,
  scoreAllCareers,
  selectLongTermResults,
  selectTopFour,
  shouldTriggerRefinement,
} from '../../lib/career-pathway/scoring';
import type { Answers } from '../../lib/career-pathway/types';

function frontendProfile(): Answers {
  return {
    A1: ['tech-quick', 'creative'],
    A2: ['tech-cs'],
    A3: ['build-website-app'],
    A4: 'low-pressure',
    B1: 'technical',
    B2: 'building',
    B_TECH: 'frontend',
    C1: 'within-year',
    C2: 'some-uni',
    C3: '15to30',
    C4: '20to100',
    C5: 'cert-yes',
    D1: 'solid',
    D2: 'remote-yes',
    E1: ['earning-well', 'remote-work'],
    E2: 'lean-into-ai',
  };
}

function writerProfile(): Answers {
  return {
    A1: ['explainer', 'organised'],
    A2: ['english-languages'],
    A3: ['writing-paid'],
    A4: 'high-pressure',
    B1: 'content-strategy',
    B2: 'creating',
    B_CONTENT: 'b2b-saas',
    C1: 'urgent',
    C2: 'no-formal',
    C3: '5to15',
    C4: 'zero',
    C5: 'cert-no',
    D1: 'solid',
    D2: 'remote-yes',
    E1: ['remote-work', 'earning-well'],
    E2: 'ai-as-tool',
  };
}

function lowConfidenceProfile(): Answers {
  return {
    A1: ['organised'],
    A2: ['english-languages'],
    A3: ['explain-technical'],
    A4: 'supported',
    B1: 'docs-devrel',
    B2: 'analysing',
    B_DEVREL: 'ux-writer',
    C1: 'within-year',
    C2: 'some-uni',
    C3: 'under5',
    C4: 'zero',
    C5: 'cert-maybe',
    D1: 'limited',
    D2: 'remote-maybe',
    E1: ['creative-freedom'],
    E2: 'ai-as-tool',
    W4: 'Sierra Leone',
  };
}

function longTermTechnicalProfile(): Answers {
  return {
    A1: ['analytical', 'tech-quick'],
    A2: ['maths-sciences', 'tech-cs'],
    A3: ['build-website-app', 'data-sense'],
    A4: 'supported',
    B1: 'technical',
    B2: 'building',
    B_TECH: 'backend',
    C1: 'within-year',
    C2: 'some-uni',
    C3: '15to30',
    C4: 'under20',
    C5: 'cert-yes',
    D1: 'solid',
    D2: 'remote-yes',
    E1: ['clear-growth', 'earning-well'],
    E2: 'ai-as-tool',
    E3: 'long-term-moat',
  };
}

describe('scoreAllCareers', () => {
  it('returns a score for every career', () => {
    const scores = scoreAllCareers(frontendProfile());
    expect(scores).toHaveLength(CAREERS.length);
  });

  it('gives frontend-dev a higher score than data-engineer for a frontend profile', () => {
    const scores = scoreAllCareers(frontendProfile());
    const frontendScore = scores.find((score) => score.career.id === 'frontend-dev')!.score;
    const dataEngineerScore = scores.find((score) => score.career.id === 'data-engineer')!.score;
    expect(frontendScore).toBeGreaterThan(dataEngineerScore);
  });

  it('gives b2b-saas-writer a higher score than devops-cloud for a writer profile', () => {
    const scores = scoreAllCareers(writerProfile());
    const writerScore = scores.find((score) => score.career.id === 'b2b-saas-writer')!.score;
    const devopsScore = scores.find((score) => score.career.id === 'devops-cloud')!.score;
    expect(writerScore).toBeGreaterThan(devopsScore);
  });

  it('penalises cert-required careers when user says cert is not realistic', () => {
    const scores = scoreAllCareers(writerProfile());
    const cybersecurityScore = scores.find((score) => score.career.id === 'cybersecurity')!.score;
    const writerScore = scores.find((score) => score.career.id === 'b2b-saas-writer')!.score;
    expect(cybersecurityScore).toBeLessThan(writerScore);
  });

  it('boosts time-to-income weight 1.5x when family pressure is high', () => {
    const urgentProfile = { ...writerProfile(), A4: 'high-pressure', C1: 'urgent' };
    const relaxedProfile = { ...writerProfile(), A4: 'supported', C1: 'urgent' };
    const urgentScores = scoreAllCareers(urgentProfile);
    const relaxedScores = scoreAllCareers(relaxedProfile);
    const urgentDataEngineer = urgentScores.find((score) => score.career.id === 'data-engineer')!.score;
    const relaxedDataEngineer = relaxedScores.find((score) => score.career.id === 'data-engineer')!.score;
    expect(urgentDataEngineer).toBeLessThan(relaxedDataEngineer);
  });

  it('scores are all non-negative', () => {
    const scores = scoreAllCareers(frontendProfile());
    scores.forEach((score) => expect(score.score).toBeGreaterThanOrEqual(0));
  });

  it('does not let ai-workflow dominate when automation readiness is weak', () => {
    const weakAiProfile: Answers = {
      A1: ['creative'],
      A2: ['art-design'],
      A3: ['writing-paid'],
      A4: 'high-pressure',
      B1: 'docs-devrel',
      B2: 'creating',
      C1: 'urgent',
      C2: 'degree',
      C3: 'under5',
      C4: 'zero',
      C5: 'cert-no',
      D1: 'solid',
      D2: 'remote-yes',
      E1: ['earning-well'],
      E2: 'lean-into-ai',
    };

    const scores = scoreAllCareers(weakAiProfile);
    const aiWorkflowScore = scores.find((score) => score.career.id === 'ai-workflow')!.score;
    const technicalWriterScore = scores.find((score) => score.career.id === 'technical-writer')!.score;
    expect(aiWorkflowScore).toBeLessThan(technicalWriterScore);
  });

  it('removes retired careers from the catalog', () => {
    ['no-code-dev', 'ux-writer', 'dev-docs', 'devrel', 'ecommerce-writer'].forEach((careerId) => {
      expect(CAREERS.some((career) => career.id === careerId)).toBe(false);
    });
  });

  it('routes docs-devrel answers into surviving writing careers', () => {
    const answers: Answers = {
      A1: ['explainer', 'organised'],
      A2: ['english-languages', 'tech-cs'],
      A3: ['writing-paid', 'explain-technical'],
      A4: 'supported',
      B1: 'docs-devrel',
      B2: 'creating',
      B_DEVREL: 'dev-docs',
      C1: 'within-year',
      C2: 'some-uni',
      C3: '15to30',
      C4: 'zero',
      C5: 'cert-no',
      D1: 'solid',
      D2: 'remote-yes',
      E1: ['remote-work', 'clear-growth'],
      E2: 'ai-as-tool',
    };

    const top4 = selectTopFour(scoreAllCareers(answers));
    expect(top4.some((result) => result.career.id === 'technical-writer')).toBe(true);
  });
});

describe('refinement scoring', () => {
  it('triggers refinement when top base score is below 60', () => {
    expect(shouldTriggerRefinement(scoreAllCareers(lowConfidenceProfile()))).toBe(true);
  });

  it('does not trigger refinement when top base score is 60 or higher', () => {
    expect(shouldTriggerRefinement(scoreAllCareers(frontendProfile()))).toBe(false);
  });

  it('applies refinement bonuses to aligned careers', () => {
    const baseScores = scoreAllCareers(lowConfidenceProfile());
    const baseAiWorkflow = baseScores.find((score) => score.career.id === 'ai-workflow')!.score;

    const refinedScores = applyRefinementBonuses(baseScores, {
      ...lowConfidenceProfile(),
      R1: 'systemize',
      R2: 'repeatable',
      R3: 'workflow_automation',
      R4: 'process',
    });

    const refinedAiWorkflow = refinedScores.find((score) => score.career.id === 'ai-workflow')!.score;
    expect(refinedAiWorkflow).toBeGreaterThan(baseAiWorkflow);
  });

  it('caps refinement bonus at 6 points per career', () => {
    const baseScores = scoreAllCareers(lowConfidenceProfile());
    const baseAiWorkflow = baseScores.find((score) => score.career.id === 'ai-workflow')!.score;

    const refinedScores = applyRefinementBonuses(baseScores, {
      ...lowConfidenceProfile(),
      R1: 'systemize',
      R2: 'repeatable',
      R3: 'workflow_automation',
      R4: 'process',
    });

    const refinedAiWorkflow = refinedScores.find((score) => score.career.id === 'ai-workflow')!.score;
    expect(refinedAiWorkflow - baseAiWorkflow).toBe(6);
  });

  it('does not apply refinement bonuses outside the base top 6 careers', () => {
    const baseScores = scoreAllCareers(lowConfidenceProfile());
    const baseBottomCareer = [...baseScores].sort((a, b) => a.score - b.score)[0]!;

    const refinedScores = applyRefinementBonuses(baseScores, {
      ...lowConfidenceProfile(),
      R1: 'debug',
      R2: 'troubleshoot',
      R3: 'build_features',
      R4: 'test',
    });

    const refinedBottomCareer = refinedScores.find((score) => score.career.id === baseBottomCareer.career.id)!;
    expect(refinedBottomCareer.score).toBe(baseBottomCareer.score);
  });

  it('still returns results after one refinement pass even if top score remains below 60', () => {
    const handcraftedScores = ['ai-workflow', 'technical-writer', 'data-analyst', 'frontend-dev'].map(
      (careerId, index) => ({
        career: CAREERS.find((career) => career.id === careerId)!,
        score: 45 - index,
      })
    );

    const refinedScores = applyRefinementBonuses(handcraftedScores, {
      ...lowConfidenceProfile(),
      R1: 'clarify',
      R2: 'write',
      R3: 'teach_persuade',
      R4: 'explain',
    });

    expect(getTopScore(refinedScores)).toBeLessThan(60);
    expect(selectTopFour(refinedScores).length).toBeGreaterThan(0);
  });
});

describe('result confidence style', () => {
  it('marks a high-score clear winner as strong', () => {
    expect(getResultConfidenceStyle([{ score: 82 }, { score: 70 }])).toBe('strong');
  });

  it('marks a moderate but clear result as reasonably strong', () => {
    expect(getResultConfidenceStyle([{ score: 64 }, { score: 58 }])).toBe('reasonably-strong');
  });

  it('marks close or low-score results as exploratory', () => {
    expect(getResultConfidenceStyle([{ score: 59 }, { score: 57 }])).toBe('exploratory');
  });
});

describe('resolveWhyItFits', () => {
  it('falls back when a placeholder would resolve to blank', () => {
    const frontendDeveloper = CAREERS.find((career) => career.id === 'frontend-dev');
    expect(frontendDeveloper).toBeDefined();

    const whyItFits = resolveWhyItFits(frontendDeveloper!, {
      A1: ['tech-quick'],
      A3: ['build-website-app'],
    });

    expect(whyItFits).toBe(frontendDeveloper!.whyItFitsFallback);
  });
});

describe('selectTopFour', () => {
  it('returns exactly 4 results for a complete profile', () => {
    const scores = scoreAllCareers(frontendProfile());
    const top4 = selectTopFour(scores);
    expect(top4).toHaveLength(4);
  });

  it('position 3 comes from a different cluster than positions 1 and 2 when possible', () => {
    const scores = scoreAllCareers(frontendProfile());
    const top4 = selectTopFour(scores);
    const cluster1 = top4[0].career.cluster;
    const cluster2 = top4[1].career.cluster;
    const cluster3 = top4[2].career.cluster;
    const usedClusters = new Set([cluster1, cluster2]);
    const otherClusterQualified = scores.some(
      (score) => score.score >= 20 && !usedClusters.has(score.career.cluster)
    );

    if (otherClusterQualified) {
      expect(cluster3).not.toBe(cluster1);
      expect(cluster3).not.toBe(cluster2);
    }
  });

  it('ranks are 1, 2, 3, 4 in order', () => {
    const scores = scoreAllCareers(frontendProfile());
    const top4 = selectTopFour(scores);
    expect(top4[0].rank).toBe(1);
    expect(top4[1].rank).toBe(2);
    expect(top4[2].rank).toBe(3);
    expect(top4[3].rank).toBe(4);
  });

  it('falls back gracefully if fewer than 4 careers qualify', () => {
    const scores = scoreAllCareers({});
    const top4 = selectTopFour(scores);
    expect(top4.length).toBeGreaterThanOrEqual(0);
    expect(top4.length).toBeLessThanOrEqual(4);
  });

  it('selects technical or data careers for the long-term moat track when possible', () => {
    const scores = scoreAllCareers(longTermTechnicalProfile(), 'long-term');
    const moatResults = selectLongTermResults(scores);
    expect(moatResults.length).toBeGreaterThan(0);
    expect(['technical', 'data']).toContain(moatResults[0].career.cluster);
  });
});
