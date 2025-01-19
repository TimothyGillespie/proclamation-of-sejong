import { letterMappingGermanHangul, specialKeyMap } from '../data/keyboard';
import { doubleMap } from '../data/korean-symbols';
import type { TypeEvent, TypeEventSubscriber } from '../types/event.types';

const shiftConversionMap: Record<string, string> = Object.entries(
    letterMappingGermanHangul
)
    .filter((singleMapping) => singleMapping[1] in doubleMap)
    .reduce(
        (acc, [key, value]) => {
            acc[key.toLocaleUpperCase()] = doubleMap[value];
            return acc;
        },
        {} as Record<string, string>
    );

const conversionMap = { ...letterMappingGermanHangul, ...shiftConversionMap };

class KeyboardService {
    private subscribers: { id: string; callback: TypeEventSubscriber }[] = [];

    constructor() {
        window.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    private handleKeydown(event: KeyboardEvent) {
        const { key } = event;

        let eventToSend: TypeEvent | undefined = undefined;

        if (key in specialKeyMap) {
            eventToSend = { type: specialKeyMap[key] };
        }

        if (key in conversionMap || key.toLocaleLowerCase() in conversionMap) {
            eventToSend = {
                type: 'character',
                character:
                    conversionMap[key] ?? conversionMap[key.toLowerCase()],
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
