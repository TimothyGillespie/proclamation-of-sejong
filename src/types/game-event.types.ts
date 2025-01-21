import type { GameStoreType } from '../store/game.store';

export type GameEventOption = {
    type: 'choice';
    id: number;
    label: string;
    onPick: (gameStore: GameStoreType) => void;
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
