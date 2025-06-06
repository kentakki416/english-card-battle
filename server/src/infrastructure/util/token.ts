import jwt from 'jsonwebtoken'

import type { IToken } from '../../3-adapter/interface/itoken'

export class Jwt implements IToken {
  /**
   * jwtを生成する
   */
  public generateToken(userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '15d'
    })
    return token
  }
}
