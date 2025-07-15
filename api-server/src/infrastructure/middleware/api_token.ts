import * as uuid from "uuid"
export class ApiTokenGenerator {
  private _token:string
  constructor() {
    this._token = ""
  }

  public get token() {
    return this._token
  }

  /**
   * APIのリクエストを識別するためのトークンを生成する
   */
  public generateApiToken() {
    this._token = uuid.v4()
    return this._token
  }
  
}
