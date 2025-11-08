import { Request, Response, NextFunction } from 'express'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
    picture: string
  }
}

export class AuthMiddleware {
  constructor() {
    // 将来的なJWT検証用に拡張可能
  }

  /**
   * Google認証middleware
   * セッショントークンの存在確認とリクエストボディのユーザー情報を使用
   */
  public verifyGoogleAuth() {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // NextAuth.jsのセッショントークンの存在確認
        const sessionToken = req.headers.authorization?.replace('Bearer ', '')
        
        // jweは細かい検証はせずセットされていればOK
        if (!sessionToken) {
          return res.status(401).json({ error: 'Session token required' })
        }

        // x-auth-statusをチェックする
        const authStatus = req.headers['x-auth-status']
        if (authStatus !== 'verified') {
          return res.status(401).json({ error: 'Authentication failed' })
        }

        // リクエストボディからユーザー情報を取得
        // NextAuth.jsサーバー側で既に検証済みの情報
        const { userId, email, name, picture } = req.body
        
        if (!userId || !email) {
          return res.status(400).json({ error: 'User information required' })
        }

        // 検証済みユーザー情報をリクエストに追加
        req.user = {
          id: userId,
          email: email,
          name: name || '',
          picture: picture || ''
        }
        
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
  //   return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //     try {
  //       const token = req.cookies.jwt || req.headers.authorization?.replace('Bearer ', '')
        
  //       if (!token) {
  //         return res.status(401).json({ error: 'No token provided' })
  //       }
        
  //       const decoded = await this.jwtService.verifyToken(token)
  //       if (!decoded || typeof decoded === 'string') {
  //         return res.status(401).json({ error: 'Invalid token' })
  //       }
        
  //       const userId = (decoded as { userId: string }).userId
  //       if (!userId) {
  //         return res.status(401).json({ error: 'Invalid token payload' })
  //       }
        
  //       req.user = {
  //         id: userId,
  //         email: '', // JWTにはemail情報がないため空文字
  //         name: '',  // JWTにはname情報がないため空文字
  //         picture: '' // JWTにはpicture情報がないため空文字
  //       }
  //       next()
  //       return
  //     } catch {
  //       return res.status(401).json({ error: 'Invalid token' })
  //     }
  //   }
  // }
} 
