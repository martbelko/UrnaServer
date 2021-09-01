import { atom } from 'recoil';

export const useridAtom = atom<number | undefined>({
    key: 'userid',
    default: undefined
});

export const accessTokenAtom = atom<string | undefined>({
    key: 'accessToken',
    default: undefined
});

export const refreshTokenAtom = atom<string | undefined>({
    key: 'refreshToken',
    default: undefined
});
