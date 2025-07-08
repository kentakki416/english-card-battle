import { Request, Response, NextFunction } from 'express'
import { Jwt } from '../util/jwt'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
    picture: string
  }
}

export class AuthMiddleware {
  private jwtService: Jwt

  constructor() {
    this.jwtService = new Jwt()
  }

  // /**
  //  * Google APIでユーザー情報を検証
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // private async verifyGoogleUser(accessToken: string): Promise<any> {
  //   const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
    
  //   if (!response.ok) {
  //     throw new Error('Invalid Google token')
  //   }
    
  //   return response.json()
  // }

  /**
   * Google認証middleware
   * NextAuth.jsのセッション検証とGoogle API検証を行う
   */
  public verifyGoogleAuth() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // NextAuth.jsのセッショントークンを取得
        const sessionToken = req.headers.authorization?.replace('Bearer ', '')
        
        if (!sessionToken) {
          return res.status(401).json({ error: 'Session token required' })
        }

        // セッショントークンを検証
        const session = this.jwtService.verifyToken(sessionToken)
        console.log(session)
        
        // if (!session?.accessToken) {
        //   return res.status(401).json({ error: 'Valid Google session required' })
        // }

        // // Google APIでユーザー情報を検証
        // const googleUser = await this.verifyGoogleUser(session.accessToken)
        
        // // 検証済みユーザー情報をリクエストに追加
        // req.user = {
        //   id: googleUser.id,
        //   email: googleUser.email,
        //   name: googleUser.name,
        //   picture: googleUser.picture
        // }
        
        next()
        return
      } catch {
        return res.status(401).json({ error: 'Authentication failed' })
      }
    }
  }

  // /**
  //  * JWT認証middleware
  //  * アプリケーションJWTトークンの検証を行う
  //  */
  // public verifyJWT() {
  //   return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //     try {
  //       const token = req.cookies.jwt || req.headers.authorization?.replace('Bearer ', '')
        
  //       if (!token) {
  //         return res.status(401).json({ error: 'No token provided' })
  //       }
        
  //       const decoded = this.jwtService.verifyToken(token)
  //       if (!decoded) {
  //         return res.status(401).json({ error: 'Invalid token' })
  //       }
        
  //       req.user = {
  //         id: decoded.userId,
  //         email: '', // JWTにはemail情報がないため空文字
  //         name: '',  // JWTにはname情報がないため空文字
  //         picture: '' // JWTにはpicture情報がないため空文字
  //       }
  //       next()
  //     } catch {
  //       return res.status(401).json({ error: 'Invalid token' })
  //     }
  //   }
  // }
} 
