import { CancelToken } from 'axios'
import { Dispatch, SetStateAction } from 'react'

import { LoadingState } from '@/core/application/common/atoms/global/loadingState'
import FailureResponse from '@/core/application/dto/common/responses/failureResponse'
import InvalidModelStateResponse from '@/core/application/dto/common/responses/invalidModelStateResponse'
import SuccessResponse from '@/core/application/dto/common/responses/successResponse'
import { CodesMap } from '@/core/domain/enums/CodesMap'
import { notifyError } from '@/infrastructure/common/components/toast/toastMessage'
import { setRecoilStateAsync } from '@/infrastructure/common/libs/recoil-outside/recoil.service'
import LoggerService from '@/infrastructure/services/logger.service'
import { refactorFormDataCommon } from '@/infrastructure/utils/helpers'

export const useApiRequestHook = () => {
  const loggerService = new LoggerService()

  async function makeRequest(
    newCancelToken: CancelToken,
    serviceInstance: any,
    endpoint: string,
    params: any,
    onSuccess: (res: any) => void,
    onError: () => void,
    setLoading?: Dispatch<SetStateAction<boolean>>
  ) {
    try {
      if (setLoading) {
        setLoading(true)
      } else {
        await setRecoilStateAsync(LoadingState, { isLoading: true, uri: endpoint })
      }
      const response = await serviceInstance(
        endpoint,
        refactorFormDataCommon(params),
        newCancelToken
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
            break
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
      }
    } catch (error) {
      notifyError('', 'An error occurred. Please contact the administrator')
      onError()
    } finally {
      if (setLoading) {
        setLoading(false)
      } else {
        await setRecoilStateAsync(LoadingState, { isLoading: false, uri: endpoint })
      }
    }
  }

  return [makeRequest]
}
