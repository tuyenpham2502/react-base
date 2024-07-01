import { Navigate } from 'react-router-dom'

import { ROUTE_PATH } from '@/core/application/common/appRouters'
import Constants from '@/core/application/common/constants'
import CookiesStorageService from '@/infrastructure/services/cookiesStorage.service'
import { getListRole } from '@/infrastructure/utils/helpers'

interface Props {
  component: React.ComponentType
  path?: string
  roles?: Array<any>
}

export const PrivateRoute: React.FC<Props> = ({ component: RouteComponent, roles = [] }) => {
  let cookiesStorage = new CookiesStorageService()
  let accessToken = cookiesStorage.readStorage(Constants.API_TOKEN_STORAGE)

  if (accessToken) {
    let roleOfUser = getListRole()
    let checkRole = false
    if (roles && roles.length) {
      roles.map((it: any) => {
        if (roleOfUser?.some((itC: any) => itC === it)) {
          checkRole = true
        }
      })
    }
    if (checkRole) {
      return <RouteComponent />
    }
    return <Navigate to={ROUTE_PATH.FORBIDDEN_ACCESS} />
    // return <RouteComponent />
  }

  return <Navigate to={ROUTE_PATH.LOGIN} />
}
