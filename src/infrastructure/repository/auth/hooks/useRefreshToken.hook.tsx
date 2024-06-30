import LoggerService from 'src/infrastructure/services/logger.service';
import { AuthManagementService } from 'src/infrastructure/repository/auth/services/auth.service';
import { Endpoint } from 'src/core/application/common/endPoint';
import { refactorFormDataCommon } from 'src/infrastructure/utils/helpers';
import { useCancelToken } from 'src/infrastructure/common/libs/hooks/canceToken.hook';
import SuccessResponse from 'src/core/application/dto/common/responses/successResponse';
import { notifyError } from 'src/infrastructure/common/components/toast/toastMessage';
import FailureResponse from 'src/core/application/dto/common/responses/failureResponse';
import InvalidModelStateResponse from 'src/core/application/dto/common/responses/invalidModelStateResponse';
import { CodesMap } from 'src/core/domain/enums/CodesMap';
import { RefreshTokenRequest } from '@/core/application/dto/identity/auth/requests/RefreshTokenRequest';

export const refreshTokenAsync = () => {
    const { newCancelToken } = useCancelToken();

    async function request(
        params: RefreshTokenRequest,
        setLoading: (value: boolean) => void,
        onSuccess: (res: any) => void,
        onError: () => void
    ) {
        const loggerService = new LoggerService();
        setLoading(true);
        const response = await new AuthManagementService().refreshTokenAsync(
            Endpoint.Auth.Login, //enpoint
            refactorFormDataCommon(params),
            newCancelToken(),
        );

        if ((response as FailureResponse)?.code !== CodesMap.CANCEL_TOKEN) {
            switch (response.status) {
                case 200: {
                    const res = (response as SuccessResponse).data;
                    if (res?.success) {
                        if (onSuccess) {
                            onSuccess(res);
                        }
                    } else {
                        onError();
                        notifyError(
                            '',
                            (res.errors?.length && res.errors[0]?.error) || 'An error occurred. Please contact the administrator',
                        );
                    }

                    return response;
                }
                case 202: {
                    notifyError(
                        '',
                        (response as FailureResponse).message || 'An error occurred. Please contact the administrator',
                    );
                    onError();
                    break;
                }
                case 400: {
                    notifyError(
                        '',
                        (response as InvalidModelStateResponse).message || 'An error occurred. Please contact the administrator',
                    );
                    loggerService.info(response as InvalidModelStateResponse);
                    onError();
                    break;
                }
                default: {
                    notifyError('', 'An error occurred. Please contact the administrator');
                    onError();
                }
            }
            setLoading(false);
            return response;
        }
        return response;
    }

    return [request];
};