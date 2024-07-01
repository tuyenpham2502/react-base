export class LogoutRequest {
  access_token: string
  refresh_token: string
  constructor(arg: { access_token: string; refresh_token: string }) {
    this.access_token = arg.access_token
    this.refresh_token = arg.refresh_token
  }
}
