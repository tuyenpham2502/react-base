export class Endpoint {
  static Auth = class {
    static Login: string = 'public/user/login'
    static RefreshToken: string = 'auth/refresh-token'
    static Logout: string = 'auth/logout'
  }
}
