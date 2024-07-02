import Constants from '@/core/application/common/constants'
import CookiesStorageService from '@/infrastructure/services/cookiesStorage.service'

export const refactorFormDataCommon = (data: any) => {
  let result: any = {}
  if (Object.keys(data)?.length) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'string') {
        result = {
          ...result,
          [key]: data[key]?.trim() || '',
        }
      } else {
        result = {
          ...result,
          [key]: data[key],
        }
      }
    })
  }
  return result
}

export const getListRole = () => {
  const cookiesStorageService = new CookiesStorageService()

  let role = cookiesStorageService.readStorage(Constants.API_ROLE_STORAGE)
  return role != null ? [role.toString()] : []
}
