import type { GameEvent } from '../types/game-event.types';

export const gameEventsInput: GameEvent[] = [
    {
        id: 1,
        name: 'Welcome',
        description: [
            'It is 1444. You are a farmer in the Joseon Kingdom by the name of Hyeongi.',
            "You tend your family's farm and reap a yearly harvest of rice.",
            "Life is humble, but it's alright.",
        ],
        trigger: (gameStore, gameEvent) =>
            !(gameEvent.id in gameStore.gameEventChoices),
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Live',
                onPick: () => {},
            },
        ],
    },
    {
        id: 2,
        name: 'Proclamation of Sejong',
        description: [
            'One morning, you are called to the central square by the village chief. A government official reads out aloud a new royal proclamation:',
            '"The Great King Sejong, in his infinite wisdom and compassion for the people, has created a new script — Hunminjeongeum — that is simple, logical, and meant for all. With this script, even a farmer can learn to read and write."',
            'You overhear the official instructing the village scribe to teach Hunminjeongeum to the people.',
            'After done farm work, you visit the village scribe to learn more about this new script. However, the two of you have never been on good terms ever since he caught you taking fruits from his apple tree. So he is reluctant to give you any lessons until you pay him back. He would take rice though.',
        ],
        trigger: (gameStore, gameEvent) =>
            gameStore.currency.rice >= 10 &&
            !(gameEvent.id in gameStore.gameEventChoices),
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Time to Atone',
                onPick: (gameStore) => {
                    gameStore.unlockUpgrade('2');
                },
            },
        ],
    },
];

export const gameEvents = Object.fromEntries(
    gameEventsInput.map((event) => [event.id, event])
) as Record<number, GameEvent>;
