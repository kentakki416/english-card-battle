import jwt, { JwtPayload } from 'jsonwebtoken'

export interface IToken {
  generateToken(payload: string): string
  verifyToken(token: string): string | JwtPayload
}

export class Jwt implements IToken {
  /**
   * jwtを生成する
   */
  public generateToken(payload: string) {
    const token = jwt.sign({ payload }, process.env.JWT_SECRET || 'secret', {
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
