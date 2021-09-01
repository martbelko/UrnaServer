import { selector } from 'recoil';
import { accessTokenAtom, refreshTokenAtom, useridAtom } from './atoms';

export const useridState = selector({
    key: 'userid',
    get: ({ get }) => {
        return get(useridAtom);
    },
});

export const accessTokenState = selector({
    key: 'accessToken',
    get: ({ get }) => {
        return get(accessTokenAtom);
    },
});

export const refreshTokenState = selector({
    key: 'refreshToken',
    get: ({ get }) => {
        return get(refreshTokenAtom);
    },
});