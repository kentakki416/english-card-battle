import { JwtPayload } from "jsonwebtoken"

export interface  IToken {
  generateToken(userId: string): string
  verifyToken(token: string): string | JwtPayload
}
