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
];

export const gameEvents = Object.fromEntries(
    gameEventsInput.map((event) => [event.id, event])
) as Record<number, GameEvent>;
