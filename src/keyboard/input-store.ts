import { combineHangul, divideHangulByGroups } from 'hangul-util';
import type {
    EvaluatedHangulBlock,
    HangulBlock,
} from '../types/challenge.types';
import type { TypeEvent } from '../types/event.types';

export class InputStore {
    public hangulBlocks: HangulBlock[] = [];

    public input(value: TypeEvent): void {
        if (value.type === 'character') {
            const lastBlock = this.hangulBlocks[
                this.hangulBlocks.length - 1
            ] ?? {
                completed: false,
                characters: [],
            };
            const blockSplit = divideHangulByGroups(
                combineHangul([...lastBlock.characters, value.character])
            );
            const startNewBlock = lastBlock.completed || blockSplit.length > 1;

            if (startNewBlock) {
                if (!lastBlock.completed && blockSplit.length > 1) {
                    const endBlocks = blockSplit.map((block, index) => {
                        return {
                            completed: index < blockSplit.length - 1,
                            characters: block as string[],
                        };
                    });

                    if (
                        lastBlock.characters.length === 1 &&
                        lastBlock.characters[0] === ' '
                    ) {
                        this.hangulBlocks = [
                            ...this.hangulBlocks,
                            ...endBlocks,
                        ];
                        return;
                    }

                    this.hangulBlocks = [
                        ...this.hangulBlocks.slice(0, -1),
                        ...endBlocks,
                    ];
                    return;
                }

                this.hangulBlocks = [
                    ...this.hangulBlocks,
                    { completed: false, characters: [value.character] },
                ];
            } else {
                const newLastBlock = {
                    completed: false,
                    characters: [...lastBlock.characters, value.character],
                };
                this.hangulBlocks = [
                    ...this.hangulBlocks.slice(0, -1),
                    newLastBlock,
                ];
            }
        }

        if (value.type === 'backspace') {
            if (this.hangulBlocks.length === 0) {
                return;
            }

            const lastBlock = this.hangulBlocks[this.hangulBlocks.length - 1];
            if (lastBlock.characters.length === 0) {
                // Remove two, because the last block is empty
                this.hangulBlocks = this.hangulBlocks.slice(0, -2);
                return;
            }

            if (lastBlock.completed) {
                // remove whole block then
                this.hangulBlocks = this.hangulBlocks.slice(0, -1);
                return;
            }

            // Otherwise only remove last character in block
            const newLastBlock = {
                completed: false,
                characters: lastBlock.characters.slice(0, -1),
            };
            this.hangulBlocks = [
                ...this.hangulBlocks.slice(0, -1),
                newLastBlock,
            ];
        }

        if (value.type === 'space') {
            if (this.hangulBlocks.length === 0) {
                this.hangulBlocks = [{ completed: true, characters: [' '] }];
                return;
            }

            const lastBlock = this.hangulBlocks[this.hangulBlocks.length - 1];
            lastBlock.completed = true;

            this.hangulBlocks = [
                ...this.hangulBlocks.slice(0, -1),
                lastBlock,
                { completed: true, characters: [' '] },
            ];
        }
    }

    public getText(): string {
        return this.hangulBlocks.map((block) => blockToString(block)).join('');
    }

    public getEvaluatedBlocks(taskText: string): EvaluatedHangulBlock[] {
        const taskBlocks = divideHangulByGroups(taskText) as string[][];
        const evaluatedBlocks = this.hangulBlocks.map((block, index) => {
            const taskBlock = taskBlocks[index] ?? [];
            const state = (
                block.characters.join('') === taskBlock.join('')
                    ? 'correct'
                    : 'incorrect'
            ) as 'correct' | 'incorrect';

            return {
                ...block,
                state,
            };
        });

        return evaluatedBlocks;
    }

    public reset() {
        this.hangulBlocks = [];
    }
}

export const blockToString = (block: HangulBlock): string => {
    if (block.characters.length === 1 && block.characters[0] === ' ') {
        return ' ';
    }

    return combineHangul(block.characters);
};
