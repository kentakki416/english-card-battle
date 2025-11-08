import bcrypt from 'bcrypt'

export interface IHash {
  passwordToHash(password: string): Promise<string>
  confirmPassword(password: string, hashedPassword: string): Promise<boolean>
}

export class Hash implements IHash {
  /**
   * パスワードをハッシュ化する
   */
  public passwordToHash = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }

  /**
   * ハッシュ化したパスワードが一致するかの確認
   */
  public confirmPassword = async (password: string, hashedPassword: string) => {
    const result = await bcrypt.compare(password, hashedPassword)
    return result
  }
}
