import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axiosRetry from 'axios-retry'
import jwtDecode from 'jwt-decode'

import Constants from '@/core/application/common/constants'
import { RefreshTokenRequest } from '@/core/application/dto/identity/auth/requests/RefreshTokenRequest'
import { refreshTokenAsync } from '@/infrastructure/repository/auth/hooks/useRefreshToken.hook'
import LocalStorageService from '@/infrastructure/services/localStorage.service'
import LoggerService from '@/infrastructure/services/logger.service'

// Request Interceptor
let loggerService = new LoggerService()
let axiosInstance = axios
let isRefreshing = false
let requests: any = []

const onRequest = (config: InternalAxiosRequestConfig | any): InternalAxiosRequestConfig => {
  let localStorageService = new LocalStorageService()

  let storage: any = localStorageService.readStorage(Constants.API_TOKEN_STORAGE)
  // Set Headers Here
  // Check Authentication Here
  // Set Loading Start Here

  if (storage?.idToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${storage?.idToken}`,
    }
  }
  return config
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // Set Loading End Here
  // Handle Response Data Here
  // Error Handling When Return Success with Error Code Here
  // loggerService.trace(`ðŸš€ [API] ${method?.toUpperCase()} ${url} | Response ${status}`);

  return response
}

// function refreshToken() {
//     return instance.post("/auth/refreshtoken", {
//       refreshToken: getLocalRefreshToken(),
//     });
//     return {data: {
//         accessToken: null
//     }}
// }

// let localStorageService = new LocalStorageService();
// let storage = localStorageService.readStorage(Constants.API_TOKEN_STORAGE);

axiosRetry(axiosInstance, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    return retryCount * 2000 // time interval between retries
  },
  retryCondition: (error: any) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.code === 'ERR_NETWORK'
    // return error.response?.status === 504 || error.response?.status === 502;
  },
})

const onErrorResponse = async (error: AxiosError | Error | any): Promise<AxiosError> => {
  if (axiosInstance.isCancel(error)) {
    return Promise.reject(error)
  }

  if (axiosInstance.isAxiosError(error)) {
    const { message } = error

    const { method, url } = error.config as AxiosRequestConfig
    const { status } = (error.response as AxiosResponse) ?? {}

    loggerService.error(`ðŸš¨ [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`)

    switch (status) {
      case 401: {
        // "Login required" || "Refresh Token"
        const originalRequest: any = error.config
        try {
          const localStorageService = new LocalStorageService()
          let token = localStorageService.readStorage(Constants.API_TOKEN_STORAGE)

          if (token?.idToken && !originalRequest._retry) {
            originalRequest._retry = true

            if (!isRefreshing) {
              isRefreshing = true
              let info: any = jwtDecode(token.idToken)
              // refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest :
              let result = await refreshTokenAsync(
                new RefreshTokenRequest({
                  userName: info['cognito:username'],
                  refreshToken: token.refreshToken,
                  recaptchaToken: '',
                })
              )
              if (result?.idToken) {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${result.idToken}`
                }
                requests.forEach((cb: any) => cb(result.idToken))
                requests = []
                return axiosInstance(originalRequest)
              }
            } else {
              return new Promise((resolve) => {
                requests.push((token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                  }
                  resolve(axiosInstance(originalRequest))
                })
              })
            }
          }
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data)
          }

          return Promise.reject(_error)
        } finally {
          isRefreshing = false
        }
        break
      }
      case 403: {
        // "Permission denied"
        break
      }
      case 404: {
        // "Invalid request"
        break
      }
      case 500: {
        break
      }
      case 502: {
        break
      }
      case 504: {
        break
      }
      default: {
        // "Unknown error occurred"
        break
      }
    }
  } else {
    loggerService.error(`ðŸš¨ [API] | Error ${error.message}`)
  }

  return Promise.reject(error)
}

const setupInterceptors = () => {
  axiosInstance.interceptors.request.use(onRequest, onErrorResponse)
  axiosInstance.interceptors.response.use(onResponse, onErrorResponse)

  return axiosInstance
}
setupInterceptors()
export default axiosInstance
