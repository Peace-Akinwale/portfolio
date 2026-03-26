import { describe, expect, it } from 'vitest';
import { CAREERS } from '../../lib/career-pathway/careers';
import { resolveWhyItFits, scoreAllCareers, selectTopFour } from '../../lib/career-pathway/scoring';
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

describe('scoreAllCareers', () => {
  it('returns a score for every career', () => {
    const scores = scoreAllCareers(frontendProfile());
    expect(scores).toHaveLength(CAREERS.length);
  });

  it('gives frontend-dev a higher score than data-engineer for a frontend profile', () => {
    const scores = scoreAllCareers(frontendProfile());
    const frontendScore = scores.find((s) => s.career.id === 'frontend-dev')!.score;
    const dataEngScore = scores.find((s) => s.career.id === 'data-engineer')!.score;
    expect(frontendScore).toBeGreaterThan(dataEngScore);
  });

  it('gives b2b-saas-writer a higher score than devops-cloud for a writer profile', () => {
    const scores = scoreAllCareers(writerProfile());
    const writerScore = scores.find((s) => s.career.id === 'b2b-saas-writer')!.score;
    const devopsScore = scores.find((s) => s.career.id === 'devops-cloud')!.score;
    expect(writerScore).toBeGreaterThan(devopsScore);
  });

  it('penalises cert-required careers when user says cert is not realistic', () => {
    const scores = scoreAllCareers(writerProfile());
    const cyberScore = scores.find((s) => s.career.id === 'cybersecurity')!.score;
    const writerScore = scores.find((s) => s.career.id === 'b2b-saas-writer')!.score;
    expect(cyberScore).toBeLessThan(writerScore);
  });

  it('boosts time-to-income weight 1.5x when family pressure is high', () => {
    const urgentProfile = { ...writerProfile(), A4: 'high-pressure', C1: 'urgent' };
    const relaxedProfile = { ...writerProfile(), A4: 'supported', C1: 'urgent' };
    const urgentScores = scoreAllCareers(urgentProfile);
    const relaxedScores = scoreAllCareers(relaxedProfile);
    const urgentDataEng = urgentScores.find((s) => s.career.id === 'data-engineer')!.score;
    const relaxedDataEng = relaxedScores.find((s) => s.career.id === 'data-engineer')!.score;
    expect(urgentDataEng).toBeLessThan(relaxedDataEng);
  });

  it('scores are all non-negative', () => {
    const scores = scoreAllCareers(frontendProfile());
    scores.forEach((s) => expect(s.score).toBeGreaterThanOrEqual(0));
  });

  it('removes retired careers from the catalog', () => {
    ['no-code-dev', 'ux-writer', 'dev-docs', 'devrel', 'ecommerce-writer'].forEach((id) => {
      expect(CAREERS.some((career) => career.id === id)).toBe(false);
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

describe('resolveWhyItFits', () => {
  it('falls back when a placeholder would resolve to blank', () => {
    const frontendDev = CAREERS.find((career) => career.id === 'frontend-dev');
    expect(frontendDev).toBeDefined();

    const whyItFits = resolveWhyItFits(frontendDev!, {
      A1: ['tech-quick'],
      A3: ['build-website-app'],
    });

    expect(whyItFits).toBe(frontendDev!.whyItFitsFallback);
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
      (s) => s.score >= 20 && !usedClusters.has(s.career.cluster)
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
});
