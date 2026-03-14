import type { Dimension } from '../config/questions20';
import { QUESTIONS_20 } from '../config/questions20';
import type { CityProfile } from '../config/cities40';
import { CITIES_40 } from '../config/cities40';

export type UserAnswers = Record<number, 'A' | 'B' | 'C'>;

export interface MatchResult {
    city: CityProfile;
    matchPercent: number;
}

function fingerprintAnswers(answers: UserAnswers): number {
    return Object.entries(answers)
        .sort(([a], [b]) => Number(a) - Number(b))
        .reduce((hash, [qId, answer]) => {
            const answerCode = answer === 'A' ? 1 : answer === 'B' ? 2 : 3;
            return (hash * 31 + Number(qId) * 7 + answerCode) % 1000003;
        }, 17);
}

function tieBreakNoise(cityName: string, fingerprint: number): number {
    let hash = fingerprint;
    for (const ch of cityName) {
        hash = (hash * 33 + ch.charCodeAt(0)) % 1000003;
    }

    // Deterministic micro-noise in [-0.002, 0.002], only used for near-ties.
    return ((hash % 2001) / 2000 - 0.5) * 0.004;
}

export function calculateMatch(answers: UserAnswers): MatchResult[] {
    const answerCount = Object.keys(answers).length;
    if (answerCount === 0) {
        return [{ city: CITIES_40[0], matchPercent: 0 }];
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
    const answerFingerprint = fingerprintAnswers(answers);

    const scores = CITIES_40.map(city => {
        let score = 0;
        for (const dim in U) {
            score += U[dim as Dimension] * city.w[dim as Dimension];
        }
        score += city.bias ?? 0;
        return { city, score, adjustedScore: score };
    });

    const topScore = Math.max(...scores.map(s => s.score));
    const tieWindow = 0.015;

    for (const entry of scores) {
        if (topScore - entry.score <= tieWindow) {
            entry.adjustedScore += tieBreakNoise(entry.city.name, answerFingerprint);
        }
    }

    const minScore = Math.min(...scores.map(s => s.adjustedScore));
    const maxScore = Math.max(...scores.map(s => s.adjustedScore));
    const eps = 0.000001;

    const results = scores.map(s => {
        const m = (s.adjustedScore - minScore) / (maxScore - minScore + eps);
        let matchPercent = Math.round(70 + 29 * m);
        if (matchPercent > 99) matchPercent = 99;
        if (matchPercent < 70) matchPercent = 70;
        return {
            city: s.city,
            matchPercent,
            adjustedScore: s.adjustedScore
        };
    });

    results.sort((a, b) => b.adjustedScore - a.adjustedScore);

    return results.map(({ city, matchPercent }) => ({ city, matchPercent }));
}
