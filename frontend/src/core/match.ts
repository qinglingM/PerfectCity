import type { Dimension } from '../config/questions20';
import { QUESTIONS_20 } from '../config/questions20';
import type { CityProfile } from '../config/cities40';
import { CITIES_40 } from '../config/cities40';

export type UserAnswers = Record<number, 'A' | 'B' | 'C'>;

export interface MatchResult {
    city: CityProfile;
    matchPercent: number;
}

export function calculateMatch(answers: UserAnswers): MatchResult {
    const answerCount = Object.keys(answers).length;
    if (answerCount === 0) {
        return { city: CITIES_40[0], matchPercent: 0 };
    }

    // Calculate User Vector U
    const U: Record<Dimension, number> = {
        CAREER: 0, QUALITY: 0, COST: 0, CULTURE: 0, NATURE: 0, URBAN: 0
    };

    for (const qIdStr in answers) {
        const qId = parseInt(qIdStr, 10);
        const answer = answers[qIdStr as unknown as number];
        const question = QUESTIONS_20.find(q => q.id === qId);
        if (!question) continue;

        const dim = question.key[answer];
        U[dim] += 1;
    }

    // Normalize U (convert to frequency)
    for (const dim in U) {
        U[dim as Dimension] = U[dim as Dimension] / answerCount;
    }

    // Calculate city scores
    const scores = CITIES_40.map(city => {
        let score = 0;
        for (const dim in U) {
            score += U[dim as Dimension] * city.w[dim as Dimension];
        }
        return { city, score };
    });

    const minScore = Math.min(...scores.map(s => s.score));
    const maxScore = Math.max(...scores.map(s => s.score));

    // Find max score city
    let best = scores[0];
    for (const s of scores) {
        if (s.score > best.score) best = s;
    }

    const eps = 0.000001;
    const m = (best.score - minScore) / (maxScore - minScore + eps);

    // Calculate final percentage 70-99 mapping as specified in PRD
    let matchPercent = Math.round(70 + 29 * m);

    // Cap at 99 just in case
    if (matchPercent > 99) matchPercent = 99;
    if (matchPercent < 70) matchPercent = 70;

    return {
        city: best.city,
        matchPercent
    };
}
