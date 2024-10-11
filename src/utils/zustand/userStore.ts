import { create, useStore } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import { getStore, removeStore, setStore, StoreMethod } from "../../chrome-services";
import { omit } from "remeda";
import log from "../logger";

/* https://doichevkostia.dev/blog/authentication-store-with-zustand/ */

const DEFAULT_USER: UserDataType = {
    accessToken: undefined,
    refreshToken: undefined,
    spreadsheetId: undefined,
}

type UserDataType = {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    spreadsheetId: string | undefined;
}

type UserStoreType = {
    user: UserDataType;

    actions: {
        setAccessToken: (accessT: string | undefined) => void;
        setRefreshToken: (refreshT: string | undefined) => void;
        setSpreadsheetId: (spreadsheetId: string | undefined) => void;
        login: (user: UserDataType) => Promise<void>;
        logout: () => void;
    };
}

export const userStore = create<UserStoreType>()(
    persist(
        (set, get) => ({
            user: DEFAULT_USER,

            actions: {
                setAccessToken: (accessT: string | undefined) => {
                    set({ user: { ...get().user, accessToken: accessT } });
                },
                setRefreshToken: (refreshT: string | undefined) => {
                    set({ user: { ...get().user, refreshToken: refreshT } });
                },
                setSpreadsheetId: (spreadsheetId: string | undefined) => {
                    set({ user: { ...get().user, spreadsheetId: spreadsheetId } });
                },

                login: async ({ accessToken, refreshToken, spreadsheetId }) => {
                    const { setAccessToken, setRefreshToken, setSpreadsheetId } = get().actions;
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                    setSpreadsheetId(spreadsheetId);
                },
                logout: () => {
                    set({ user: DEFAULT_USER });
                }
            }
        }),
        {
            name: 'user-store',
            storage: {
                async getItem(name: string): Promise<StorageValue<any>> {
                    
                    const data = await getStore(name, StoreMethod.SYNC);
                    log('getItem: ', name, 'data: ', data);
                    return { 
                        state: data[name]
                    };
                },

                async setItem(name: string, storageValue: StorageValue<any>) {
                    log('setItem: ', name, 'data: ', storageValue.state);
                    await setStore(name, storageValue.state, StoreMethod.SYNC);
                },

                async removeItem(name: string): Promise<void> {
                    await removeStore(name, StoreMethod.SYNC);
                }
            },
            partialize: (state) => {
                return omit(state, ['actions']);
            }
        }
    )
);

export type ExtractState<S> = S extends {
        getState: () => infer T;
    }
    ? T
    : never;
    type Params<U> = Parameters<typeof useStore<typeof userStore, U>>;

const userSelector = (state: ExtractState<typeof userStore>) => state.user;
const accessTokenSelector = (state: ExtractState<typeof userStore>) => state.user.accessToken;
const refreshTokenSelector = (state: ExtractState<typeof userStore>) => state.user.refreshToken;
const spreadsheetIdSelector = (state: ExtractState<typeof userStore>) => state.user.spreadsheetId;
const actionsSelector = (state: ExtractState<typeof userStore>) => state.actions;

export const getUser = () => userSelector(userStore.getState());
export const getAccessToken = () => accessTokenSelector(userStore.getState());
export const getRefreshToken = () => refreshTokenSelector(userStore.getState());
export const getSpreadsheetId = () => spreadsheetIdSelector(userStore.getState())
export const getActions = () => actionsSelector(userStore.getState())

function useUserStore<U>(selector: (state: UserStoreType) => U, equalityFn?: (a: U, b: U) => boolean) {
    return useStore(userStore, selector, equalityFn);
}

export const useUser = () => useUserStore(userSelector);
export const useActions = () => useUserStore(actionsSelector);