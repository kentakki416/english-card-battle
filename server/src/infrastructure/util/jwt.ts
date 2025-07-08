import jwt, { JwtPayload } from 'jsonwebtoken'

import { IToken } from '../../adapter/interface/itoken'

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

  /**
   * jwtを検証する
   */
  public verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret')
  }
}
