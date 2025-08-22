import ky from 'ky';
import { AuthService } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (response.ok) {
          return response;
        }

        if (response.status === 401) {
          const originalRequest = request.clone();
          
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
              return ky(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          isRefreshing = true;

          try {
            const authResponse = await AuthService.refreshToken();
            const newToken = authResponse.accessToken;
            
            processQueue(null, newToken);
            
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            return ky(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return response;
      }
    ]
  }
});

export const authApi = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000
});
