import type { Challenge } from '../types/game-state.types';
import { basicJamo, doubleJamo } from './korean-symbols';

const repeatEachNTimes = (input: string[], n: number): string => {
    return input
        .reduce(
            (acc, jamo) => [...acc, ...new Array(n).fill(jamo)],
            [] as string[]
        )
        .join(' ');
};

export const challenges: Record<number, Challenge> = {
    1: {
        task: repeatEachNTimes(basicJamo.slice(0, 3), 3),
        translation: null,
    },
    2: {
        task: repeatEachNTimes(basicJamo.slice(3, 6), 3),
        translation: null,
    },
    3: {
        task: repeatEachNTimes(basicJamo.slice(6, 9), 3),
        translation: null,
    },
    4: {
        task: repeatEachNTimes(basicJamo.slice(9, 12), 3),
        translation: null,
    },
    5: {
        task: repeatEachNTimes(basicJamo.slice(12, 15), 3),
        translation: null,
    },
    6: {
        task: repeatEachNTimes(basicJamo.slice(15, 18), 3),
        translation: null,
    },
    7: {
        task: repeatEachNTimes(basicJamo.slice(18, 21), 3),
        translation: null,
    },
    8: {
        task: repeatEachNTimes(basicJamo.slice(21, 24), 3),
        translation: null,
    },
    9: {
        task: repeatEachNTimes(basicJamo.slice(24), 3),
        translation: null,
    },
    10: {
        task: repeatEachNTimes(doubleJamo.slice(0, 3), 3),
        translation: null,
    },
    11: { task: repeatEachNTimes(doubleJamo.slice(3), 3), translation: null },
};
