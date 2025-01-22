import { letterMapping, specialKeyMap } from '../data/keyboard';
import { doubleMap } from '../data/korean-symbols';
import type { TypeEvent, TypeEventSubscriber } from '../types/event.types';

const conversionMapFrom = (inputMap: Record<string, string>) => {
    const shiftConversionMap: Record<string, string> = Object.entries(inputMap)
        .filter((singleMapping) => singleMapping[1] in doubleMap)
        .reduce(
            (acc, [key, value]) => {
                acc[key.toLocaleUpperCase()] = doubleMap[value];
                return acc;
            },
            {} as Record<string, string>
        );

    const conversionMap = { ...inputMap, ...shiftConversionMap };

    return conversionMap;
};

class KeyboardService {
    private subscribers: { id: string; callback: TypeEventSubscriber }[] = [];
    private conversionMap: Record<string, string>;

    constructor() {
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        this.conversionMap = conversionMapFrom(letterMapping.hangul);
    }

    public changeConversionMap(layout: string) {
        this.conversionMap = conversionMapFrom(letterMapping[layout]);
    }

    private handleKeydown(event: KeyboardEvent) {
        const { key } = event;

        let eventToSend: TypeEvent | undefined = undefined;

        if (key in specialKeyMap) {
            eventToSend = { type: specialKeyMap[key] };
        }

        if (
            key in this.conversionMap ||
            key.toLocaleLowerCase() in this.conversionMap
        ) {
            eventToSend = {
                type: 'character',
                character:
                    this.conversionMap[key] ??
                    this.conversionMap[key.toLowerCase()],
            };
        }

        if (eventToSend != undefined) {
            this.subscribers.forEach((subscriber) =>
                subscriber.callback(eventToSend)
            );
        }
    }

    public subscribe(callback: (event: TypeEvent) => void) {
        const id = Math.random().toString(36).substring(2, 9);
        this.subscribers.push({ id, callback });

        return {
            unsubscribe: () => {
                this.subscribers = this.subscribers.filter(
                    (subscriber) => subscriber.id !== id
                );
            },
        };
    }
}

export const keyboardService = new KeyboardService();
