import type { EvaluationCriterion } from '../models/evaluation';

export interface ScoreEngineResult {
  weightedScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  passFail: 'PASS' | 'FAIL';
}

export function calculateEvaluationResult(criteria: EvaluationCriterion[]): ScoreEngineResult {
  if (!criteria || !criteria.length) {
    return { weightedScore: 0, grade: 'F', passFail: 'FAIL' };
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const c of criteria) {
    weightedSum += c.score * c.weight;
    totalWeight += c.weight;
  }

  // Normalize to scale of 10 if weights don't sum to 1
  const finalScore = totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(1)) : 0;

  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (finalScore >= 8.5) grade = 'A';
  else if (finalScore >= 7.0) grade = 'B';
  else if (finalScore >= 5.5) grade = 'C';
  else if (finalScore >= 4.0) grade = 'D';
  else grade = 'F';

  const passFail: 'PASS' | 'FAIL' = grade !== 'F' ? 'PASS' : 'FAIL';

  return {
    weightedScore: finalScore,
    grade,
    passFail
  };
}
