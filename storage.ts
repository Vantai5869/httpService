import AsyncStorage from "@react-native-async-storage/async-storage";

export type SaveTokenInput = {
  accessToken: string;
  refreshToken: string;
};
export type SaveLanguage = {
  language: string;
};

export const saveToken = async (data: SaveTokenInput) => {
  if(data.refreshToken){
    return Promise.all([
      AsyncStorage.setItem("accessToken", data.accessToken),
      AsyncStorage.setItem("refreshToken", data.refreshToken),
    ]);
  }else{
    return Promise.all([
      AsyncStorage.setItem("accessToken", data.accessToken),
    ]);
  }

};

export const removeToken = async () => {
  return Promise.all([
    AsyncStorage.removeItem("accessToken"),
    AsyncStorage.removeItem("refreshToken"),
  ]);
};
export const saveLanguage = async (data: SaveLanguage) => {
  return Promise.all([AsyncStorage.setItem("language", data.language)]);
};

export const persistedStorage = {
  getItem: async (key: string) => {
    const data = await AsyncStorage.getItem(key);
    return data;
  },
  setItem(key: string, value: any) {
    try {
      return AsyncStorage.getItem(key, value);
    } catch (err) {
      throw err;
    }
  },
  removeItem(key: string) {
    return AsyncStorage.removeItem(key);
  },
};
