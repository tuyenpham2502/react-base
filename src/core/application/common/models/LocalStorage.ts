export default class LocalStorage {
  public isAuthenticated: boolean = false
  public token: string = ''
  public refreshToken: string = ''

  constructor(isAuthenticated: boolean, token: string, refreshToken: string) {
    this.isAuthenticated = isAuthenticated
    this.token = token
    this.refreshToken = refreshToken
  }
}
