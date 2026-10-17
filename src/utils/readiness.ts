// Interview readiness score, calculated in code from the other results (never by the AI).
// Formula: 40% job fit + 20% ATS readiness + 20% STAR story coverage + 20% gap score.
// It is only calculated when every input exists. There are no fallback numbers.

export interface ReadinessInputs {
  fitScore: number;
  atsScore: number;
  storiesWithEvidence: number; // out of 7 themes
  criticalGaps: number;
  moderateGaps: number;
  minorGaps: number;
}

export interface ReadinessResult {
  score: number;
  breakdown: {
    fitContribution: number;
    atsContribution: number;
    storyContribution: number;
    gapContribution: number;
    storiesWithEvidence: number;
    gapScore: number;
  };
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function computeReadiness(input: ReadinessInputs): ReadinessResult {
  const values = [input.fitScore, input.atsScore, input.storiesWithEvidence];
  if (values.some((v) => typeof v !== 'number' || Number.isNaN(v))) {
    throw new Error('Readiness needs the fit score, ATS score and story bank.');
  }
  const stories = Math.max(0, Math.min(7, Math.round(input.storiesWithEvidence)));
  const storyCoverage = Math.round((stories / 7) * 100);
  const gapScore = clamp(100 - input.criticalGaps * 15 - input.moderateGaps * 7 - input.minorGaps * 2);

  const fitContribution = Math.round(clamp(input.fitScore) * 0.4);
  const atsContribution = Math.round(clamp(input.atsScore) * 0.2);
  const storyContribution = Math.round(storyCoverage * 0.2);
  const gapContribution = Math.round(gapScore * 0.2);

  return {
    score: Math.min(100, fitContribution + atsContribution + storyContribution + gapContribution),
    breakdown: { fitContribution, atsContribution, storyContribution, gapContribution, storiesWithEvidence: stories, gapScore },
  };
}
