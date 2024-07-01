import jwtDecode from 'jwt-decode'

import { AuthManagementService } from '../services/auth.service'

import Constants from '@/core/application/common/constants'
import { Endpoint } from '@/core/application/common/endPoint'
import FailureResponse from '@/core/application/dto/common/responses/failureResponse'
import InvalidModelStateResponse from '@/core/application/dto/common/responses/invalidModelStateResponse'
import SuccessResponse from '@/core/application/dto/common/responses/successResponse'
import { RefreshTokenRequest } from '@/core/application/dto/identity/auth/requests/RefreshTokenRequest'
import { CodesMap } from '@/core/domain/enums/CodesMap'
import { notifyError } from '@/infrastructure/common/components/toast/toastMessage'
import CookiesStorageService from '@/infrastructure/services/cookiesStorage.service'
import LoggerService from '@/infrastructure/services/logger.service'
import { getListRole, refactorFormDataCommon } from '@/infrastructure/utils/helpers'

export const refreshTokenAsync = async (params: RefreshTokenRequest) => {
  const loggerService = new LoggerService()
  const cookiesStorageService = new CookiesStorageService()
  const response = await new AuthManagementService().refreshTokenAsync(
    Endpoint.Auth.RefreshToken, //enpoint
    refactorFormDataCommon(params)
  )
  let result: any = {}
  if ((response as FailureResponse)?.code !== CodesMap.CANCEL_TOKEN) {
    switch (response.status) {
      case 200: {
        const res = (response as SuccessResponse).data
        if (res?.success) {
          let getListRoleToken = getListRole()
          let listRoleNewToken: any = jwtDecode(res.access_token)
          if (
            getListRoleToken &&
            getListRoleToken.length &&
            listRoleNewToken &&
            listRoleNewToken.length &&
            getListRoleToken.toString() !== listRoleNewToken.toString()
          ) {
            cookiesStorageService.setStorage(Constants.API_TOKEN_STORAGE, res.access_token)
            result = res || {}
          }
        } else {
          cookiesStorageService.removeStorage(Constants.API_TOKEN_STORAGE)
          window.location.href = '/'
          notifyError(
            '',
            (res.errors?.length && res.errors[0]?.error) ||
              'An error occurred. Please contact the administrator'
          )
        }

        break
      }
      case 202: {
        notifyError(
          '',
          (response as FailureResponse).message ||
            'An error occurred. Please contact the administrator'
        )
        const res = (response as SuccessResponse).data
        if (!res?.success) {
          window.location.href = '/'
        }
        break
      }
      case 400: {
        notifyError(
          '',
          (response as InvalidModelStateResponse).message ||
            'An error occurred. Please contact the administrator'
        )
        loggerService.info(response as InvalidModelStateResponse)
        break
      }
      default: {
        notifyError('', 'An error occurred. Please contact the administrator')
      }
    }
    return result
  }
  return result
}
