import FailureResponse from '@/core/application/dto/common/responses/failureResponse'
import InvalidModelStateResponse from '@/core/application/dto/common/responses/invalidModelStateResponse'
import SuccessResponse from '@/core/application/dto/common/responses/successResponse'
import { CodesMap } from '@/core/domain/enums/CodesMap'
import { notifyError } from '@/infrastructure/common/components/toast/toastMessage'
import { useCancelToken } from '@/infrastructure/common/libs/hooks/cancelToken.hook'
import LoggerService from '@/infrastructure/services/logger.service'
import { refactorFormDataCommon } from '@/infrastructure/utils/helpers'

export const useApiRequestHook = () => {
  const { newCancelToken } = useCancelToken()
  const loggerService = new LoggerService()

  let requestQueue: (() => Promise<any>)[] = []
  let isProcessing = false

  async function processQueue() {
    if (isProcessing) return
    isProcessing = true

    while (requestQueue.length > 0) {
      const nextRequest = requestQueue.shift()
      if (nextRequest) await nextRequest()
    }

    isProcessing = false
  }

  async function queueRequest(
    serviceInstance: any,
    endpoint: string,
    params: any,
    onSuccess: (res: any) => void,
    onError: () => void
  ) {
    const queuedRequest = async () => {
      const response = await serviceInstance(
        endpoint,
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

      processQueue()
    }

    requestQueue.push(queuedRequest)
    processQueue()
  }

  return [queueRequest]
}
