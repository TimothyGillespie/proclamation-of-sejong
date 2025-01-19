export type SpecialKeyTypeEvent = {
    type:
        | 'space'
        | 'enter'
        | 'backspace'
        | 'delete'
        | 'tab'
        | 'escape'
        | 'arrowLeft'
        | 'arrowRight'
        | 'arrowUp'
        | 'arrowDown'
        | 'meta'
        | 'shift'
        | 'ctrl'
        | 'alt';
};

export type CharacterTypeEvent = {
    type: 'character';
    character: string;
};

export type TypeEvent = SpecialKeyTypeEvent | CharacterTypeEvent;

export type TypeEventSubscriber = (event: TypeEvent) => void;
