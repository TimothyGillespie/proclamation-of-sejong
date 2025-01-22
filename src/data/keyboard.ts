import type { SpecialKeyTypeEvent } from '../types/event.types';

const letterMappingGermanHangul: Record<string, string> = {
    q: 'ㅂ',
    w: 'ㅈ',
    e: 'ㄷ',
    r: 'ㄱ',
    t: 'ㅅ',
    z: 'ㅛ',
    u: 'ㅕ',
    i: 'ㅑ',
    o: 'ㅐ',
    p: 'ㅔ',
    a: 'ㅁ',
    s: 'ㄴ',
    d: 'ㅇ',
    f: 'ㄹ',
    g: 'ㅎ',
    h: 'ㅗ',
    j: 'ㅓ',
    k: 'ㅏ',
    l: 'ㅣ',
    y: 'ㅋ',
    x: 'ㅌ',
    c: 'ㅊ',
    v: 'ㅍ',
    b: 'ㅠ',
    n: 'ㅜ',
    m: 'ㅡ',
};

const letterMappingEnglishHangul: Record<string, string> = {
    q: 'ㅂ',
    w: 'ㅈ',
    e: 'ㄷ',
    r: 'ㄱ',
    t: 'ㅅ',
    y: 'ㅛ',
    u: 'ㅕ',
    i: 'ㅑ',
    o: 'ㅐ',
    p: 'ㅔ',
    a: 'ㅁ',
    s: 'ㄴ',
    d: 'ㅇ',
    f: 'ㄹ',
    g: 'ㅎ',
    h: 'ㅗ',
    j: 'ㅓ',
    k: 'ㅏ',
    l: 'ㅣ',
    z: 'ㅋ',
    x: 'ㅌ',
    c: 'ㅊ',
    v: 'ㅍ',
    b: 'ㅠ',
    n: 'ㅜ',
    m: 'ㅡ',
};

const letterMappingFrenchHangul: Record<string, string> = {
    a: 'ㅂ',
    z: 'ㅈ',
    e: 'ㄷ',
    r: 'ㄱ',
    t: 'ㅅ',
    y: 'ㅛ',
    u: 'ㅕ',
    i: 'ㅑ',
    o: 'ㅐ',
    p: 'ㅔ',
    q: 'ㅁ',
    s: 'ㄴ',
    d: 'ㅇ',
    f: 'ㄹ',
    g: 'ㅎ',
    h: 'ㅗ',
    j: 'ㅓ',
    k: 'ㅏ',
    l: 'ㅣ',
    w: 'ㅋ',
    x: 'ㅌ',
    c: 'ㅊ',
    v: 'ㅍ',
    b: 'ㅠ',
    n: 'ㅜ',
    ',': 'ㅡ',
};

const letterMappingHangulHangul: Record<string, string> = {
    ㅂ: 'ㅂ',
    ㅈ: 'ㅈ',
    ㄷ: 'ㄷ',
    ㄱ: 'ㄱ',
    ㅅ: 'ㅅ',
    ㅛ: 'ㅛ',
    ㅕ: 'ㅕ',
    ㅑ: 'ㅑ',
    ㅐ: 'ㅐ',
    ㅔ: 'ㅔ',
    ㅁ: 'ㅁ',
    ㄴ: 'ㄴ',
    ㅇ: 'ㅇ',
    ㄹ: 'ㄹ',
    ㅎ: 'ㅎ',
    ㅗ: 'ㅗ',
    ㅓ: 'ㅓ',
    ㅏ: 'ㅏ',
    ㅣ: 'ㅣ',
    ㅋ: 'ㅋ',
    ㅌ: 'ㅌ',
    ㅊ: 'ㅊ',
    ㅍ: 'ㅍ',
    ㅠ: 'ㅠ',
    ㅜ: 'ㅜ',
    ㅡ: 'ㅡ',
};

export const letterMapping: Record<string, Record<string, string>> = {
    qwertz: letterMappingGermanHangul,
    qwerty: letterMappingEnglishHangul,
    azerty: letterMappingFrenchHangul,
    hangul: letterMappingHangulHangul,
};

export const specialKeyMap: Record<string, SpecialKeyTypeEvent['type']> = {
    ' ': 'space',
    Enter: 'enter',
    Backspace: 'backspace',
    Delete: 'delete',
    Tab: 'tab',
    Escape: 'escape',
    ArrowLeft: 'arrowLeft',
    ArrowRight: 'arrowRight',
    ArrowUp: 'arrowUp',
    ArrowDown: 'arrowDown',
    Meta: 'meta',
    Shift: 'shift',
    Control: 'ctrl',
    Alt: 'alt',
};
