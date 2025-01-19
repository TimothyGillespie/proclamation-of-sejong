import { expect, describe, it } from 'vitest';

import { InputStore } from './input-store';

describe('InputStoreService', () => {
    it('should work with space', () => {
        const inputStoreService = new InputStore();
        inputStoreService.input({ type: 'character', character: 'ㅎ' });
        inputStoreService.input({ type: 'character', character: 'ㅏ' });
        inputStoreService.input({ type: 'character', character: 'ㄴ' });
        inputStoreService.input({ type: 'space' });
        inputStoreService.input({ type: 'character', character: 'ㅈ' });
        inputStoreService.input({ type: 'character', character: 'ㅜ' });
        inputStoreService.input({ type: 'character', character: 'ㅇ' });

        expect(inputStoreService.getText()).toEqual('한 중');
    });

    it('should work with only jamo and spaces', () => {
        const inputStoreService = new InputStore();
        inputStoreService.input({ type: 'character', character: 'ㅎ' });
        inputStoreService.input({ type: 'space' });
        expect(inputStoreService.getText()).toEqual('ㅎ ');
        inputStoreService.input({ type: 'backspace' });
        expect(inputStoreService.getText()).toEqual('ㅎ');
        inputStoreService.input({ type: 'backspace' });
        expect(inputStoreService.getText()).toEqual('');
    });

    it('problem case', () => {
        const inputStoreService = new InputStore();
        inputStoreService.input({ type: 'character', character: 'ㅌ' });
        inputStoreService.input({ type: 'character', character: 'ㅡ' });
        inputStoreService.input({ type: 'character', character: 'ㅅ' });
        inputStoreService.input({ type: 'character', character: 'ㅡ' });
        inputStoreService.input({ type: 'character', character: 'ㅌ' });
        inputStoreService.input({ type: 'character', character: 'ㅡ' });

        inputStoreService.input({ type: 'space' });

        inputStoreService.input({ type: 'character', character: 'ㅇ' });
        inputStoreService.input({ type: 'character', character: 'ㅏ' });
        inputStoreService.input({ type: 'character', character: 'ㄴ' });

        inputStoreService.input({ type: 'space' });

        inputStoreService.input({ type: 'character', character: 'ㄹ' });
        inputStoreService.input({ type: 'space' });
        expect(inputStoreService.getText()).toEqual('트스트 안 ㄹ ');
    });
});
