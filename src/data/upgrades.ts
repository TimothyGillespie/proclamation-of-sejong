import { TICKSTAMP_EVENTS } from '../store/game.store';
import type { Currency } from '../types/game-state.types';
import type { Upgrade } from '../types/upgrades.types';

const createPrices = (
    basePrice: Partial<Currency>,
    costMultiplier: number,
    numberOfUpgrades: number
): Partial<Currency>[] => {
    return Array.from({ length: numberOfUpgrades }, (_, index) => {
        return Object.fromEntries(
            Object.entries(basePrice).map(([key, value]) => {
                return [
                    key,
                    Math.ceil(value * Math.pow(costMultiplier, index)),
                ];
            })
        );
    });
};

export const upgrades: Upgrade[] = [
    {
        id: 1,
        name: 'Purchase Field',
        description: 'Trade some rice for a new field',
        cost: createPrices({ rice: 10 }, 1.4, 23),
        effect: (gameStore) => {
            gameStore.createField();
        },
    },
    {
        id: 2,
        name: 'Payback the Scribe',
        description: 'Pay the scribe in rice to start learning Hunminjeongeum',
        cost: [{ rice: 15 }],
        effect: (gameStore) => {
            gameStore.startChallenge(1);
        },
    },
    {
        id: 3,
        name: 'Send your Petition',
        description:
            'Send your petition for a new irigation canal to the local government. For some reason, the post office takes rice as payment, as well.',
        cost: [{ rice: 20 }],
        effect: (gameStore) => {
            gameStore.createTickStamp(TICKSTAMP_EVENTS.PETITION_SENT);
        },
    },
];
