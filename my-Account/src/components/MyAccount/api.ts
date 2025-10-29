import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useUserStore } from '../store/userStore';

export interface APIResponse {
  data?: {
    is_error?: boolean;
  };
  api_response?: {
    is_error?: boolean;
    message?: string;
  };
}

interface CustomInstance
  extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const JAVA_API = import.meta.env.VITE_JAVA_API;
const VALIDATION_API = import.meta.env.VITE_VALIDATION_API;

if (!JAVA_API || !VALIDATION_API) {
  console.warn('Environment variables not loaded:', {
    JAVA_API,
    VALIDATION_API,
  });
}

const createAPI = (baseURL: string): CustomInstance => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  const reauthorize = async (
    userId: string,
    config: AxiosRequestConfig,
  ): Promise<any> => {
    try {
      // Get fresh token
      const response = await axios.post(
        `${baseURL}/reauthorize`,
        { userId },
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (!response.data.token) {
        throw new Error('No token received');
      }

      // Update user store with new token
      const { user, setUser } = useUserStore.getState();
      if (!user) {
        throw new Error('No user found in store');
      }
      setUser({ ...user, token: response.data.token });

      // Retry original request with new token
      return instance({
        ...config,
        headers: {
          ...config.headers,
          jwt: response.data.token,
          'x-retry': 'true',
        },
      });
    } catch (error) {
      console.error('Reauthorization failed:', error);
      const { logout } = useUserStore.getState();
      logout();
      window.location.href = '/login?expired=true';
      throw error;
    }
  };

  instance.interceptors.response.use(
    ({ data }) => {
      if (data.data?.is_error || data.api_response?.is_error) {
        return Promise.reject(data.api_response?.message || 'API Error');
      }
      return data;
    },

    async (error: AxiosError) => {
      // Handle 401 (Unauthorized) errors
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }

      const { user, logout } = useUserStore.getState();

      if (!user?.userId || error.config?.headers?.['x-retry']) {
        logout();
        window.location.href = '/login?expired=true';
        return Promise.reject(error);
      }

      try {
       if (!error.config) throw error;
const result = await reauthorize(user.userId, error.config);
        return result;
      } catch (reAuthError) {
        logout();
        window.location.href = '/login?expired=true';
        return Promise.reject(reAuthError);
      }
    },
  );

  instance.interceptors.request.use(
  ((config: any) => {
    const { user } = useUserStore.getState();
    config.headers = config.headers ?? {};
    if (!config.url?.includes('authc/login') && user?.token) {
      config.headers.jwt = user.token;
    }
    return config;
  }) as any
);

  return instance;
};

export const API = createAPI(JAVA_API!);
export const SPECIFIC_GATEWAY_API = createAPI(VALIDATION_API!);

export default API;
