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
        task: [
            repeatEachNTimes(basicJamo.slice(0, 3), 3),
            repeatEachNTimes(basicJamo.slice(3, 6), 3),
            repeatEachNTimes(basicJamo.slice(6, 9), 3),
            repeatEachNTimes(basicJamo.slice(9, 12), 3),
            repeatEachNTimes(basicJamo.slice(12, 15), 3),
            repeatEachNTimes(basicJamo.slice(15, 18), 3),
            repeatEachNTimes(basicJamo.slice(18, 21), 3),
            repeatEachNTimes(basicJamo.slice(21, 24), 3),
            repeatEachNTimes(basicJamo.slice(24), 3),
            repeatEachNTimes(doubleJamo.slice(0, 3), 3),
            repeatEachNTimes(doubleJamo.slice(3), 3),
        ].map((text) => ({ text })),
        onCompletion: (gameStore) => {
            gameStore.mountGameEvent(3);
        },
    },
    2: {
        task: [
            { text: '농장', translation: 'farm' },
            { text: '밭', translation: 'field' },
            { text: '쌀', translation: '(uncooked) rice' },
            { text: '농부', translation: 'farmer' },
        ],
        onCompletion: (gameStore) => {
            gameStore.mountGameEvent(4);
        },
    },
    3: {
        task: [{ text: '현기' }],
        onCompletion: (gameStore) => {
            gameStore.mountGameEvent(5);
        },
    },
    4: {
        task: [{ text: '현 기' }],
        onCompletion: (gameStore) => {
            gameStore.mountGameEvent(6);
        },
    },
    5: {
        task: [
            {
                text: '존경하는 관청 대인들께',
                translation: 'To the esteemed officials',
            },
            {
                text: '저는 겸손한 농부입니다',
                translation: 'I am but a humble farmer.',
            },
            {
                text: '저희 농장은 물이 부족합니다',
                translation: 'Our farm lacks water.',
            },
            {
                text: '새 우물을 만들어 주세요',
                translation: 'Please build a new well.',
            },
            {
                text: '감사합니다',
                translation: 'Thank you.',
            },
            {
                text: '현 기',
                translation: 'Hyeongi',
            },
        ],
        onCompletion: (gameStore) => {
            gameStore.mountGameEvent(7);
        },
    },
};
