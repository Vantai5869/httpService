import axios, { AxiosError, AxiosResponse } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import qs from "qs";
import { persistedStorage, removeToken, saveToken } from '../common/storage';

type ApiConfig = {
  uri: String;
  params?: Object;
  request?: any;
};

const CLIENT_BASE_URL = 'https://15ae-222-254-34-56.eu.ngrok.io/api';
const REFRESH_TOKEN_URL = CLIENT_BASE_URL + '/refreshToken';

class Client {
  authAxios: any;
  publicAxios: any;
  constructor() {
    this.authAxios = axios.create({
      baseURL: CLIENT_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      }
    });

    this.publicAxios = axios.create({
      baseURL: CLIENT_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      }
    });

    this.authAxios.interceptors.request.use(async (config: any) => {
      if (!config.headers.Authorization) {
        const token = await persistedStorage?.getItem("accessToken");
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    }, (error: any) => {
      return Promise.reject(error);
    },
    );

    this.authAxios.interceptors.response.use(
      (config: AxiosResponse) => {
        console.log(config);
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    const refreshAuthLogic = async (failedRequest: any) => {
      const data = {
        refreshToken: await persistedStorage?.getItem("refreshToken")
      };

      const options = {
        method: 'POST',
        data,
        url: REFRESH_TOKEN_URL,
      };

      try {
        const tokenRefreshResponse = await axios(options);
        failedRequest.response.config.headers.Authorization =
          'Bearer ' + tokenRefreshResponse.data.accessToken;
        saveToken(tokenRefreshResponse.data);
        return await Promise.resolve();
      } catch (e) {
        removeToken()
      }
    };
    createAuthRefreshInterceptor(this.authAxios, refreshAuthLogic, {});
  }

  async GET(apiConfig: ApiConfig) {
    const { uri, params } = apiConfig;
    let url = CLIENT_BASE_URL + uri;
    try {
      const res = await this.authAxios.get(url, {
        params,
      });
      return res;
    } catch (error) {
      console.log({error});
      
      throw error;
    }
  }

  async POST(apiConfig: ApiConfig) {
    const { uri, request, params } = apiConfig;
    let url = CLIENT_BASE_URL + uri;

    try {
      const res = await this.authAxios.post(url, request, {
        params
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async PUT(apiConfig: ApiConfig) {
    const { uri, request, params } = apiConfig;
    let url = CLIENT_BASE_URL + uri;

    try {
      const res = await this.authAxios.put(url, request, {
        params
      });
      return res;
    } catch (error) {
      throw error;
    }
  }

  async DELETE(apiConfig: ApiConfig) {
    const { uri, params } = apiConfig;
    let url = CLIENT_BASE_URL + uri;

    try {
      const res = await this.authAxios.delete(url, params);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async POST_ENCODED(apiConfig: ApiConfig) {
    const { uri, request, params } = apiConfig;
    const url = CLIENT_BASE_URL + uri;

    const body = qs.stringify(request);
    try {
      const res = await this.authAxios.post(url, body, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async PUT_ENCODED(apiConfig: ApiConfig) {
    const { uri, request, params } = apiConfig;
    const url = CLIENT_BASE_URL + uri;

    const body = qs.stringify(request);
    try {
      const res = await this.authAxios.put(url, body, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async POST_FORM_DATA(apiConfig: ApiConfig) {
    const { uri, request, params } = apiConfig;
    const url = CLIENT_BASE_URL + uri;

    try {
      const res = await this.authAxios.post(url, request, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async PUT_FORM_DATA(apiConfig: ApiConfig) {
    const { uri, request, params } = apiConfig;
    const url = CLIENT_BASE_URL + uri;

    try {
      const res = await this.authAxios.put(url, request, {
        ...params,
        headers: {
          ...(params as any)?.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

};

export default new Client();
