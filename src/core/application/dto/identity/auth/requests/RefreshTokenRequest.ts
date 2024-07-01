export class RefreshTokenRequest {
  userName: string
  refreshToken: string
  recaptchaToken: string
  constructor(arg: { userName: string; refreshToken: string; recaptchaToken: string }) {
    this.userName = arg.userName
    this.refreshToken = arg.refreshToken
    this.recaptchaToken = arg.recaptchaToken
  }
}
