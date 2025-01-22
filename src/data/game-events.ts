import { TICKSTAMP_EVENTS } from '../store/game.store';
import type { GameEvent } from '../types/game-event.types';

export const gameEventsInput: GameEvent[] = [
    {
        id: 0,
        name: 'Start',
        description: [
            'Welcome to this game of mine and thank you for seeking it out.',
            'This is a very early version of the game. If you come across a bug, have ideas or any other feedback get in touch with me via email (timothy@gillespie.eu) or on Discord (id: sometimothy).',
            'I hope you enjoy the game. Before, we can begin though I need to know your keyboard layout',
        ],
        trigger: (gameStore, gameEvent) =>
            !(gameEvent.id in gameStore.gameEventChoices),
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'QWERTY (English Keyboard)',
                onPick: (gameStore) => {
                    gameStore.setKeyboardLayout('qwerty');
                    gameStore.mountGameEvent(1);
                },
            },
            {
                type: 'choice',
                id: 2,
                label: 'QWERTZ (German Keyboard)',
                onPick: (gameStore) => {
                    gameStore.setKeyboardLayout('qwertz');
                    gameStore.mountGameEvent(1);
                },
            },
            {
                type: 'choice',
                id: 3,
                label: 'AZERTY (French Keyboard)',
                onPick: (gameStore) => {
                    gameStore.setKeyboardLayout('azerty');
                    gameStore.mountGameEvent(1);
                },
            },
            {
                type: 'choice',
                id: 4,
                label: 'Hangul (Korean Keyboard in Hangul mode)',
                onPick: (gameStore) => {
                    gameStore.setKeyboardLayout('hangul');
                    gameStore.mountGameEvent(1);
                },
            },
        ],
    },
    {
        id: 1,
        name: 'Welcome',
        description: [
            'It is 1444. You are a farmer in the Joseon Kingdom by the name of Hyeongi.',
            "You tend your family's farm and reap a yearly harvest of rice.",
            "Life is humble, but it's alright.",
        ],
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Live',
                onPick: () => {},
            },
        ],
    },
    {
        id: 2,
        name: 'Proclamation of Sejong',
        description: [
            'One morning, you are called to the central square by the village chief. A government official reads out aloud a new royal proclamation:',
            '"The Great King Sejong, in his infinite wisdom and compassion for the people, has created a new script — Hunminjeongeum — that is simple, logical, and meant for all. With this script, even a farmer can learn to read and write."',
            'You overhear the official instructing the village scribe to teach Hunminjeongeum to the people.',
            'After done farm work, you visit the village scribe to learn more about this new script. However, the two of you have never been on good terms ever since he caught you taking fruits from his apple tree. So he is reluctant to give you any lessons until you pay him back. He would take rice though.',
        ],
        trigger: (gameStore, gameEvent) =>
            gameStore.currency.rice >= 10 &&
            !(gameEvent.id in gameStore.gameEventChoices),
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Time to Atone',
                onPick: (gameStore) => {
                    gameStore.unlockUpgrade(2);
                },
            },
        ],
    },
    {
        id: 3,
        name: 'First Words',
        description: [
            "You have learned the letters, but you can't write a word yet.",
            "It's time to learn how to put your letters into syllables.",
            'The scribe teaches you some farming terms, and you practice writing them.',
        ],
        trigger: undefined,
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Practice',
                onPick: (gameStore) => {
                    gameStore.startChallenge(2);
                },
            },
        ],
    },
    {
        id: 4,
        name: 'More practice',
        description: [
            "You're understand how to write Hangul. You are not very used to it but you're getting better and better.",
            "The lessons is not quite over. The scribe shows you one more word, but doesn't tell you what it means, yet.",
            '현기',
        ],
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Practice',
                onPick: (gameStore) => {
                    gameStore.startChallenge(3);
                },
            },
        ],
    },
    {
        id: 5,
        name: '현기',
        description: [
            "You have written it, but you not sure yet what this is. You're trying to recollect the letters.",
            'Your thought is interrupted by the scribe complementing your brush work. He hands you a much nicer piece of paper and a much finer, more delicate brush.',
            '"Don\'t be so sloppy with your writing. This is a very important word."',
            "It's dawning on you, this is...",
        ],
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Ask the Neighbors',
                onPick: (gameStore) => {
                    gameStore.startChallenge(4);
                },
            },
        ],
    },
    {
        id: 6,
        name: '현 기',
        description: [
            'This is your name.',
            "You're overcome by feelings - an amazed tear rolls down your cheek.",
            'Logically, you understood and knew what reading and writing meant. To experience it, however, you find yourself wholely unprepared with the opportunities it brings.',
            'You ask the scribe to teach you how to write a letter to the local government.',
        ],
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Petition the Government',
                onPick: (gameStore) => {
                    gameStore.startChallenge(5);
                },
            },
        ],
    },
    {
        id: 7,
        name: 'Petition the Government',
        description: [
            'You have written a letter to the local government, asking for a new well to be built on your farm. You only need to send it via the post office.',
            "You pack your things and thank the scribe many times over. The scribe insists on your keeping what you've written for studying at home.",
            "Arriving at home your parents are already eating dinner. You show them the name of yours. They don't understand, but when you explain it to them, they are boastfully proud. Never could they have imagined their Hyeongi would be literate. You feel a bit sorry for your friends who will inevitably compared to you by their parents.",
            'However, you decide to keep your letter a secret for now.',
        ],
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'What a Beautiful Day',
                onPick: (gameStore) => {
                    gameStore.unlockUpgrade(3);
                },
            },
        ],
    },
    {
        id: 8,
        name: 'Strangers',
        description: [
            'About two weeks have gone by since you sent your letter when you see two men that are not from your village. They are obviously no farmers, but they seem to draw something and survey the land.',
        ],
        trigger: (gameStore, gameEvent) =>
            gameStore.ticksSinceTicketstamp(TICKSTAMP_EVENTS.PETITION_SENT) >=
                2000 && !(gameEvent.id in gameStore.gameEventChoices),
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Might that have been my letter?',
                onPick: () => {},
            },
        ],
    },
    {
        id: 9,
        name: 'The Well',
        description: [
            'Another week goes by when a group of men close to your farm. They are carrying tools and materials and start digging a whole in the ground.',
            "You're parents are very puzzled and approach the men. They are told that the local government has ordered a new well to be built in this spot too help the local farmers.",
            'This is incredible, there is no doubt. This was you. You did this.',
            'With the extra water, your crops grow stronger and healthier than ever before and the harvest has doubled for the same plot of land.',
        ],
        trigger: (gameStore, gameEvent) =>
            gameStore.ticksSinceTicketstamp(TICKSTAMP_EVENTS.PETITION_SENT) >=
                3000 &&
            gameEvent.id - 1 in gameStore.gameEventChoices &&
            !(gameEvent.id in gameStore.gameEventChoices),
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'This is incredible',
                onPick: (gameStore) => {
                    gameStore.currencyModifiers.rice.base += 1;
                    gameStore.mountGameEvent(99999);
                },
            },
        ],
    },
    {
        id: 99999,
        name: 'Work in Progress',
        description: [
            'This is currently the end of the game. I hope you enjoyed it.',
            'If you have any feedback, ideas or bug reports, please get in touch with me via email (timothy@gillespie.eu) or on Discord (id: sometimothy).',
            'if you want updates on this game do get in contact with me as well. I will notify you when I have something new to show.',
            'Thank you for playing.',
        ],
        options: [
            {
                type: 'choice',
                id: 1,
                label: 'Restart',
                onPick: (gameStore) => {
                    gameStore.$reset();
                    window.location.href = window.location.href; // See App.vue
                },
            },
            {
                type: 'choice',
                id: 2,
                label: 'Continue Anway',
                onPick: () => {},
            },
        ],
    },
];

export const gameEvents = Object.fromEntries(
    gameEventsInput.map((event) => [event.id, event])
) as Record<number, GameEvent>;
