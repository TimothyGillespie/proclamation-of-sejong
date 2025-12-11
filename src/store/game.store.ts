import { defineStore } from 'pinia';
import { challenges } from '../data/challenges';
import type { Currency, FarmField, GameState } from '../types/game-state.types';
import { upgrades } from '../data/upgrades';
import { useToastStore } from './toast.store';
import { gameEvents, gameEventsInput } from '../data/game-events';
import type { GameEvent } from '../types/game-event.types';
import { keyboardService } from '../keyboard/typing.service';

export const TICKSTAMP_EVENTS = {
    PETITION_SENT: 'petition-sent',
};

const EVENT_CHECK_INTERVAL = 100;

const getFieldById = (state: GameState) => (farmId: number) =>
    state.farm.fields[farmId];
const getUpgradeLevel = (state: GameState) => (upgradeId: number) =>
    state.upgradeLevels[upgradeId] ?? 0;
const getUpgradeById = (state: GameState) => (upgradeId: number) => {
    return state.availableUpgrades[upgradeId];
};
const getCurrentCostForUpgrade = (state: GameState) => (upgradeId: number) => {
    const upgrade = getUpgradeById(state)(upgradeId);

    if (upgrade == undefined) {
        return undefined;
    }

    const currentLevel = getUpgradeLevel(state)(upgradeId);
    return upgrade.cost[currentLevel];
};

const canPurchaseUpgrade = (state: GameState) => (upgradeId: number) => {
    const upgrade = getUpgradeById(state)(upgradeId);

    if (upgrade == undefined) {
        return false;
    }

    const currentCost = getCurrentCostForUpgrade(state)(upgradeId);
    if (currentCost == undefined) {
        return false;
    }

    return Object.entries(currentCost).every(([key, value]) => {
        return state.currency[key as keyof Currency] >= value;
    });
};

const currentGameEvent = (state: GameState): GameEvent | null => {
    if (state.currentGameEventId == null) {
        return null;
    }

    return gameEvents[state.currentGameEventId] ?? null;
};

const currentChallenge = (state: GameState) =>
    challenges[state.currentChallengeId ?? -1] ?? null;

const ticksSinceTicketstamp = (state: GameState) => (id: string) => {
    return state.timeTicks - state.tickStamps[id];
};

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            currency: {
                rice: 0,
            },
            currencyModifiers: {
                rice: { base: 1, multiplier: 1 },
            },
            farm: {
                fields: {
                    1: { state: 'barren' },
                } as Record<number, FarmField>,
                cycle: 0,
            },
            currentChallengeId: null,
            completeChallengeIds: [] as number[],
            timeTicks: 0,
            availableUpgrades: Object.fromEntries(
                upgrades
                    .slice(0, 1)
                    .map((singleUpgrade) => [singleUpgrade.id, singleUpgrade])
            ),
            upgradeLevels: {},
            currentGameEventId: null,
            gameEventChoices: {},
            tickStamps: {},
            tickSpeed: 1,
            keyboardLayout: 'hangul',
        } as GameState;
    },
    getters: {
        getFieldById,
        getUpgradeLevel,
        getUpgradeById,
        getCurrentCostForUpgrade,
        canPurchaseUpgrade,
        currentGameEvent,
        currentChallenge,
        ticksSinceTicketstamp,
    },
    actions: {
        plantField(farmId: number) {
            if (this.farm.fields[farmId].state !== 'barren') {
                return;
            }
            this.farm.fields[farmId].state = 'planted';
        },
        harvestField(farmId: number) {
            if (this.farm.fields[farmId].state !== 'ripe') {
                return;
            }
            this.currency.rice +=
                this.currencyModifiers.rice.base *
                this.currencyModifiers.rice.multiplier;
            this.farm.fields[farmId].state = 'barren';
        },
        tickTime() {
            this.timeTicks += this.tickSpeed;
            if (this.timeTicks > this.farm.cycle * 1000) {
                this.increaseFarmCycle();
            }

            if (
                this.currentGameEventId == null &&
                this.timeTicks % EVENT_CHECK_INTERVAL === 0
            ) {
                const triggeredGameEvents = gameEventsInput.filter(
                    (gameEvent) => {
                        return (
                            gameEvent.trigger != undefined &&
                            gameEvent.trigger(this, gameEvent)
                        );
                    }
                );

                if (triggeredGameEvents.length > 0) {
                    const event = triggeredGameEvents[0];
                    this.mountGameEvent(event.id);
                }
            }
        },
        increaseFarmCycle() {
            this.farm.cycle += 1;
            Object.values(this.farm.fields).forEach((field) => {
                if (field.state === 'planted') {
                    field.state = 'growing';
                } else if (field.state === 'growing') {
                    field.state = 'ripe';
                }
            });
        },
        createField() {
            const nextId =
                Math.max(...Object.keys(this.farm.fields).map(Number), 0) + 1;
            this.farm.fields[nextId] = { state: 'barren' };
        },
        startChallenge(id: number) {
            if (this.currentChallengeId === id || challenges[id] == undefined) {
                return;
            }

            this.currentChallengeId = id;
        },
        completeChallenge() {
            if (this.currentChallengeId == null) {
                return;
            }

            const currentChallengeId = this.currentChallengeId;
            this.completeChallengeIds = [
                ...this.completeChallengeIds,
                currentChallengeId,
            ];
            this.currentChallenge.onCompletion(this);

            // If the challenge chose a new challenge, keep it - otherwise the challenge
            if (this.currentChallengeId === currentChallengeId) {
                this.currentChallengeId = null;
            }
        },
        pay(cost: Partial<Currency>): boolean {
            const canAfford = Object.entries(cost).every(([key, value]) => {
                return this.currency[key as keyof Currency] >= value;
            });

            if (!canAfford) {
                return false;
            }

            Object.entries(cost).forEach(([key, value]) => {
                this.currency[key as keyof Currency] -= value;
            });

            return true;
        },
        incrementUpgradeLevel(upgradeId: number) {
            this.upgradeLevels[upgradeId] = this.getUpgradeLevel(upgradeId) + 1;
            const upgradeCost = this.getCurrentCostForUpgrade(upgradeId);
            if (upgradeCost == undefined) {
                delete this.availableUpgrades[upgradeId];
                return;
            }
        },
        purchaseUpgrade(upgradeId: number) {
            const upgrade = this.getUpgradeById(upgradeId);
            if (upgrade == undefined) {
                return;
            }

            const currentCost = this.getCurrentCostForUpgrade(upgradeId);
            if (currentCost == undefined) {
                return;
            }

            const toastStore = useToastStore();
            if (this.pay(currentCost) === false) {
                toastStore.addToast(
                    {
                        message: "You can't afford this upgrade",
                        type: 'error',
                    },
                    3000
                );
                return;
            }

            this.incrementUpgradeLevel(upgradeId);

            upgrade.effect(this);
        },
        mountGameEvent(eventId: number) {
            this.gameEventChoices[eventId] = [];
            this.currentGameEventId = eventId;
        },
        makeGameEventChoice(choiceId: number) {
            const gameEvent = this.currentGameEvent;
            if (gameEvent == null) {
                return;
            }

            const choice = gameEvent.options.find(
                (option) => option.id === choiceId
            );

            if (choice == undefined) {
                return;
            }

            choice.onPick(this);
            this.gameEventChoices[gameEvent.id].push(choiceId);
            this.currentGameEventId = null;
        },
        unlockUpgrade(id: number) {
            const upgrade = upgrades.find((upgrade) => upgrade.id === id);
            if (upgrade == undefined) {
                return;
            }

            this.availableUpgrades[id] = upgrade;
        },
        createTickStamp(id: string) {
            this.tickStamps[id] = this.timeTicks;
        },
        setKeyboardLayout(layout: string) {
            this.keyboardLayout = layout;
            keyboardService.changeConversionMap(layout);
        },
    },
    persist: true,
});

export type GameStoreType = ReturnType<typeof useGameStore>;
