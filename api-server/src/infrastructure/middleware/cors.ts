import { Request, Response, NextFunction } from 'express'
export class CorsMiddleware {
  /**
   * CORS設定
   */
  public cors() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      res.header('Access-Control-Allow-Credentials', 'true')
      
      // プリフライトリクエストの処理
      if (req.method === 'OPTIONS') {
        res.sendStatus(200)
        return
      }
      
      next()
    }
  }
}
