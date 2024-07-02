import { Endpoint } from '@/core/application/common/endPoint'
import { useCancelToken } from '@/infrastructure/common/libs/hooks/cancelToken.hook'
import { useApiRequestHook } from '@/infrastructure/common/libs/hooks/useApiRequest.hook'
import { AuthManagementService } from '@/infrastructure/repository/auth/services/auth.service'

export const useLogoutHook = () => {
  const { newCancelToken } = useCancelToken()
  const [requestCommon] = useApiRequestHook()

  async function request(
    params: any,
    onSuccess: (res: any) => void,
    onError: () => void,
    isLoading: boolean = true
  ) {
    await requestCommon(
      newCancelToken(),
      new AuthManagementService().logoutAsync,
      Endpoint.Auth.Logout,
      params,
      onSuccess,
      onError,
      isLoading
    )
  }

  return [request]
}
