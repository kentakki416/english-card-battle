import express from 'express'
export class CorsMiddleware {
  private _app: express.Express
  constructor(app: express.Express) {
    this._app = app
  }

  /**
   * CORS設定
   */
  public useCors() {
    this._app.use((req, res, next) => {
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
    })
  }
}
