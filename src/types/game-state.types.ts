import type { Upgrade } from './upgrades.types';

export type Currency = {
    rice: number;
};

export type FarmField = {
    state: 'barren' | 'planted' | 'growing' | 'ripe';
};

export type Challenge = {
    task: string;
    translation: string | null;
};

export type GameState = {
    currency: Currency;
    farm: {
        fields: Record<number, FarmField>;
        cycle: number;
    };
    challenge: {
        currentChallenge: Challenge;
        currentChallengeId: number;
    } | null;
    timeTicks: number;
    availableUpgrades: Record<string, Upgrade>;
    upgradeLevels: Record<string, number>;
    currentGameEventId: number | null;
    gameEventChoices: Record<string, number[]>;
};
