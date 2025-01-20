import type { GameStoreType } from '../store/game.store';
import type { GameState } from './game-state.types';

export type GameEventOption = {
    type: 'choice';
    id: number;
    label: string;
    onPick: (gameState: GameState) => void;
};

export type GameEvent = {
    id: number;
    name: string;
    description: string[];
    trigger: (
        gameStore: GameStoreType,
        gameEvent: Omit<GameEvent, 'trigger'>
    ) => boolean;
    options: GameEventOption[];
};
