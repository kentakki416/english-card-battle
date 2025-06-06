export class User {
  /** DB用のユーザーID */
  private _id = ''
  /** アプリケーション用のユーザーID */
  private readonly _userId: number
  /** ユーザー名 */
  private _name: string
  /** ハッシュ化されたパスワード */
  private _password: string
  /** 性別 */
  private _gender: string
  /** プロフィール画像URL */
  private _profilePic: string

  constructor(name: string, password: string, gender: string, profilePic: string) {
    if (!userBisinessRule.checkNameLength(name)) {
      throw new Error('ユーザー名は3文字以上8文字以下である必要があります')
    }
    this._userId = Math.floor(Math.random() * 1000)
    this._name = name
    this._password = password
    this._gender = gender
    this._profilePic = profilePic
  }

  public get id() {
    return this._id
  }

  public get userId() {
    return this._userId
  }

  public get name() {
    return this._name
  }

  public get password() {
    return this._password
  }

  public get gender() {
    return this._gender
  }
  public get profilePic() {
    return this._profilePic
  }
}

/**
  * ユーザーのビジネスルール
  * checkがtrueならばOK、falseならば❌
  */
export const userBisinessRule = {
  /**
   * ユーザー名は3文字以上で８文字以下
   */
  checkNameLength: (name: string) => {
    return name.length >= 3 && name.length <= 8
  },
  /**
   * ハッシュ化される前のパスワードは5文字以上12文字以下
   */
  checkPasswordLength: (pass: string) => {
    return pass.length >= 5 && pass.length <= 12
  }
}
