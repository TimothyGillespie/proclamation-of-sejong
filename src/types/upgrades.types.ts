import type { GameStoreType } from '../store/game.store';
import type { Currency } from './game-state.types';

export type Upgrade = {
    id: number;
    name: string;
    description: string;
    cost: Partial<Currency>[];
    costMultiplier?: number;
    effect: (gameState: GameStoreType) => void;
};
