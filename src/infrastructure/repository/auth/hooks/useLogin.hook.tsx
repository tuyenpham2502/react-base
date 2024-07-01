import { Endpoint } from '@/core/application/common/endPoint'
import FailureResponse from '@/core/application/dto/common/responses/failureResponse'
import InvalidModelStateResponse from '@/core/application/dto/common/responses/invalidModelStateResponse'
import SuccessResponse from '@/core/application/dto/common/responses/successResponse'
import { LoginRequest } from '@/core/application/dto/identity/auth/requests/LoginRequest'
import { CodesMap } from '@/core/domain/enums/CodesMap'
import { notifyError } from '@/infrastructure/common/components/toast/toastMessage'
import { useCancelToken } from '@/infrastructure/common/libs/hooks/canceToken.hook'
import { AuthManagementService } from '@/infrastructure/repository/auth/services/auth.service'
import LoggerService from '@/infrastructure/services/logger.service'
import { refactorFormDataCommon } from '@/infrastructure/utils/helpers'

export const useLoginHook = () => {
  const { newCancelToken } = useCancelToken()

  async function request(
    params: LoginRequest,
    setLoading: (value: boolean) => void,
    onSuccess: (res: any) => void,
    onError: () => void
  ) {
    const loggerService = new LoggerService()
    setLoading(true)
    const response = await new AuthManagementService().loginAsync(
      Endpoint.Auth.Login, //enpoint
      refactorFormDataCommon(params),
      newCancelToken()
    )

    if ((response as FailureResponse)?.code !== CodesMap.CANCEL_TOKEN) {
      switch (response.status) {
        case 200: {
          const res = (response as SuccessResponse).data
          if (res?.success) {
            if (onSuccess) {
              onSuccess(res)
            }
          } else {
            onError()
            notifyError(
              '',
              (res.errors?.length && res.errors[0]?.error) ||
                'An error occurred. Please contact the administrator'
            )
          }

          return response
        }
        case 202: {
          notifyError(
            '',
            (response as FailureResponse).message ||
              'An error occurred. Please contact the administrator'
          )
          onError()
          break
        }
        case 400: {
          notifyError(
            '',
            (response as InvalidModelStateResponse).message ||
              'An error occurred. Please contact the administrator'
          )
          loggerService.info(response as InvalidModelStateResponse)
          onError()
          break
        }
        default: {
          notifyError('', 'An error occurred. Please contact the administrator')
          onError()
        }
      }
      setLoading(false)
      return response
    }
    return response
  }

  return [request]
}
