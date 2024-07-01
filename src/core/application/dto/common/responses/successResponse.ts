import { RequestResponse } from './requestResponse'

export default class SuccessResponse extends RequestResponse {
  status: number = 200
  message: string = ''
  data: any

  constructor(message: string, data: any) {
    super(200)
    this.message = message
    this.data = data
  }
}
