import { defineStore } from 'pinia';
import { challenges } from '../data/challenges';
import type { Currency, FarmField, GameState } from '../types/game-state.types';
import { upgrades } from '../data/upgrades';
import { useToastStore } from './toast.store';
import { gameEvents, gameEventsInput } from '../data/game-events';
import type { GameEvent } from '../types/game-event.types';

const getFieldById = (state: GameState) => (farmId: number) =>
    state.farm.fields[farmId];
const getUpgradeLevel = (state: GameState) => (upgradeId: string) =>
    state.upgradeLevels[upgradeId] ?? 0;
const getUpgradeById = (state: GameState) => (id: string) => {
    return state.availableUpgrades[id];
};
const getCurrentCostForUpgrade = (state: GameState) => (id: string) => {
    const upgrade = getUpgradeById(state)(id);

    if (upgrade == undefined) {
        return undefined;
    }

    const currentLevel = getUpgradeLevel(state)(id);
    return upgrade.cost[currentLevel];
};

const canPurchaseUpgrade = (state: GameState) => (id: string) => {
    const upgrade = getUpgradeById(state)(id);

    if (upgrade == undefined) {
        return false;
    }

    const currentCost = getCurrentCostForUpgrade(state)(id);
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

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            currency: {
                rice: 0,
            },
            farm: {
                fields: {
                    1: { state: 'barren' },
                } as Record<number, FarmField>,
                cycle: 0,
            },
            challenge: null,
            timeTicks: 0,
            availableUpgrades: Object.fromEntries(
                upgrades
                    .slice(0, 1)
                    .map((singleUpgrade) => [singleUpgrade.id, singleUpgrade])
            ),
            upgradeLevels: {},
            currentGameEventId: null,
            gameEventChoices: {},
        } as GameState;
    },
    getters: {
        getFieldById,
        getUpgradeLevel,
        getUpgradeById,
        getCurrentCostForUpgrade,
        canPurchaseUpgrade,
        currentGameEvent,
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
            this.currency.rice += 1;
            this.farm.fields[farmId].state = 'barren';
        },
        tickTime() {
            this.timeTicks += 1;
            if (this.timeTicks % 1000 === 0) {
                this.increaseFarmCycle();
            }

            if (this.currentGameEventId == null) {
                const triggeredGameEvents = gameEventsInput.filter(
                    (gameEvent) => {
                        return gameEvent.trigger(this, gameEvent);
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
            const challenge = challenges[id];

            if (this.challenge == null) {
                this.challenge = {
                    currentChallenge: challenge,
                    currentChallengeId: id,
                };
                return;
            }

            this.challenge.currentChallenge = challenge;
            this.challenge.currentChallengeId = id;
        },
        completeChallenge() {
            if (this.challenge == null) {
                return;
            }
            const nextId = this.challenge.currentChallengeId + 1;
            this.startChallenge(nextId);
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
        incrementUpgradeLevel(upgradeId: string) {
            this.upgradeLevels[upgradeId] = this.getUpgradeLevel(upgradeId) + 1;
            const upgradeCost = this.getCurrentCostForUpgrade(upgradeId);
            if (upgradeCost == undefined) {
                delete this.availableUpgrades[upgradeId];
                return;
            }
        },
        purchaseUpgrade(id: string) {
            const upgrade = this.getUpgradeById(id);
            if (upgrade == undefined) {
                return;
            }

            const currentCost = this.getCurrentCostForUpgrade(id);
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

            this.incrementUpgradeLevel(id);

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
        unlockUpgrade(id: string) {
            const upgrade = upgrades.find((upgrade) => upgrade.id === id);
            if (upgrade == undefined) {
                return;
            }

            this.availableUpgrades[id] = upgrade;
        },
    },
});

export type GameStoreType = ReturnType<typeof useGameStore>;
