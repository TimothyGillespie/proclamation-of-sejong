import type { GameStoreType } from '../store/game.store';
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
        id: '1',
        name: 'Purchase Field',
        description: 'Trade some rice for a new field',
        cost: createPrices({ rice: 10 }, 1.4, 19),
        effect: (gameStore) => {
            gameStore.createField();
        },
    },
];
