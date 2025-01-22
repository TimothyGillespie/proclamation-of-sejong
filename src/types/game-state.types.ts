import type { GameStoreType } from '../store/game.store';
import type { Upgrade } from './upgrades.types';

export type Currency = {
    rice: number;
};

export type FarmField = {
    state: 'barren' | 'planted' | 'growing' | 'ripe';
};

export type Challenge = {
    task: { text: string; translation?: string }[];
    onCompletion: (gameStore: GameStoreType) => void;
};

export type CurrencyModifier = {
    base: number;
    multiplier: number;
};

export type GameState = {
    currency: Currency;
    currencyModifiers: Record<keyof Currency, CurrencyModifier>;
    farm: {
        fields: Record<number, FarmField>;
        cycle: number;
    };
    currentChallengeId: number | null;
    completeChallengeIds: number[];
    timeTicks: number;
    availableUpgrades: Record<number, Upgrade>;
    upgradeLevels: Record<number, number>;
    currentGameEventId: number | null;
    gameEventChoices: Record<string, number[]>;
    tickStamps: Record<string, number>;
    tickSpeed: number;
    keyboardLayout: string;
};
