# Google認証 サーバー実装

## 必要なライブラリ
```bash
npm install jsonwebtoken axios
npm install --save-dev @types/jsonwebtoken
```

## トークン検証の仕組み

### 1. Google APIでのトークン検証
```typescript
// src/infrastructure/auth/google_auth_provider.ts
import axios from 'axios';

export class GoogleAuthProvider {
  async verifyToken(accessToken: string) {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      picture: response.data.picture,
    };
  }
}
```

### 2. JWTトークン生成
```typescript
// src/infrastructure/util/jwt_service.ts
import jwt from 'jsonwebtoken';

export class JWTService {
  constructor(private secret: string) {}

  generateToken(userId: string): string {
    return jwt.sign({ userId }, this.secret, {
      expiresIn: '24h',
    });
  }

  verifyToken(token: string): { userId: string } {
    return jwt.verify(token, this.secret) as { userId: string };
  }
}
```

## サインアップAPI

### 1. コントローラー
```typescript
// src/adapter/controller/auth/signup_controller.ts
export class SignupController {
  constructor(private signupUseCase: SignupUseCase) {}

  async handle(request: SignupControllerRequest) {
    try {
      const result = await this.signupUseCase.execute({
        provider: request.provider,
        accessToken: request.accessToken,
      });

      return {
        success: true,
        user: result.user,
        token: result.authToken.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
```

### 2. ユースケース
```typescript
// src/usecase/auth/signup_usecase.ts
export class SignupUseCase {
  async execute(request: SignupRequest): Promise<SignupResponse> {
    // 1. Google APIでユーザー情報を取得
    const userInfo = await this.googleAuthProvider.verifyToken(request.accessToken);

    // 2. 既存ユーザーをチェック
    const existingUser = await this.userRepository.findByProviderId(
      'google',
      userInfo.id.toString()
    );

    let user: User;
    if (existingUser) {
      user = existingUser;
    } else {
      // 3. 新規ユーザーを作成
      user = await this.userRepository.create({
        email: userInfo.email,
        name: userInfo.name,
        avatarUrl: userInfo.picture,
        provider: 'google',
        providerId: userInfo.id.toString(),
      });
    }

    // 4. JWTトークンを生成
    const token = this.jwtService.generateToken(user.id);
    const authToken = await this.authTokenRepository.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return { user, authToken };
  }
}
```

## 環境変数
```env
# .env
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=mongodb://localhost:27017/english_card_battle
```

## API エンドポイント
```
POST /api/auth/signup
Content-Type: application/json

{
  "provider": "google",
  "accessToken": "google_access_token"
}

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatarUrl": "https://...",
    "provider": "google",
    "providerId": "google_user_id"
  },
  "token": "jwt_token"
}
```

## 検証フロー
1. フロントエンドからアクセストークンを受け取る
2. Google APIでトークンを検証し、ユーザー情報を取得
3. データベースにユーザー情報を保存
4. JWTトークンを生成
5. フロントエンドにユーザー情報とJWTトークンを返す

## JWT Middleware実装

### 1. JWT検証Middleware
```typescript
// src/infrastructure/middleware/jwt_auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ILogger } from '../../adapter/interface/ilogger';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export class JWTAuthMiddleware {
  constructor(private logger: ILogger, private jwtSecret: string) {}

  authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // 1. Authorization headerからトークンを取得
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Authorization header is required'
        });
      }

      const token = authHeader.substring(7); // "Bearer "を除去

      // 2. JWTトークンを検証
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      
      // 3. リクエストオブジェクトにユーザー情報を追加
      req.user = {
        userId: decoded.userId
      };

      this.logger.info(`User authenticated: ${decoded.userId}`);
      next();
    } catch (error) {
      this.logger.error(new Error(`JWT verification failed: ${error}`));
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  };

  // オプションの認証（認証が失敗しても続行可能）
  optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // 認証なしで続行
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      
      req.user = {
        userId: decoded.userId
      };

      this.logger.info(`Optional auth successful: ${decoded.userId}`);
      next();
    } catch (error) {
      this.logger.warn(`Optional auth failed: ${error}`);
      next(); // 認証失敗でも続行
    }
  };
}
```

### 2. ルーターでの使用例
```typescript
// src/infrastructure/router/auth_router.ts
import { JWTAuthMiddleware, AuthenticatedRequest } from '../middleware/jwt_auth';

export class AuthRouter {
  private _jwtAuth: JWTAuthMiddleware;

  constructor(router: Router, db: Db | null, logger: ILogger, apiToken: string) {
    this._router = router;
    this._db = db;
    this._logger = logger;
    this._apiToken = apiToken;
    
    // JWT認証middlewareを初期化
    this._jwtAuth = new JWTAuthMiddleware(
      this._logger,
      process.env.JWT_SECRET || 'secret'
    );
    
    this._setupRoutes();
  }

  private _setupRoutes() {
    // 認証不要なエンドポイント
    this._router.post('/auth/signup', async (req, res) => {
      // サインアップ処理
    });

    // 認証が必要なエンドポイント
    this._router.get('/user/profile', 
      this._jwtAuth.authenticate, // JWT認証を適用
      async (req: AuthenticatedRequest, res) => {
        try {
          const userId = req.user?.userId;
          if (!userId) {
            return res.status(401).json({
              success: false,
              error: 'User not authenticated'
            });
          }

          // ユーザープロフィール取得処理
          const user = await this._userRepository.findById(userId);
          
          res.json({
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl
            }
          });
        } catch (error) {
          this._logger.error(new Error(`Failed to get user profile: ${error}`));
          res.status(500).json({
            success: false,
            error: 'Internal server error'
          });
        }
      }
    );

    // オプション認証のエンドポイント
    this._router.get('/public/data', 
      this._jwtAuth.optionalAuth, // 認証は任意
      async (req: AuthenticatedRequest, res) => {
        const isAuthenticated = !!req.user;
        const userId = req.user?.userId;

        res.json({
          success: true,
          data: {
            message: 'Public data',
            isAuthenticated,
            userId: userId || null
          }
        });
      }
    );
  }
}
```

### 3. エラーハンドリングの改善
```typescript
// src/infrastructure/middleware/error_handler.ts
import { Request, Response, NextFunction } from 'express';
import type { ILogger } from '../../adapter/interface/ilogger';

export class ErrorHandlerMiddleware {
  constructor(private logger: ILogger) {}

  handle = (error: Error, req: Request, res: Response, next: NextFunction) => {
    this.logger.error(error);

    // JWT関連のエラー
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    // その他のエラー
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  };
}
```

### 4. セキュリティ強化
```typescript
// src/infrastructure/middleware/security.ts
import { Request, Response, NextFunction } from 'express';

export class SecurityMiddleware {
  // CORS設定
  cors = (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  };

  // レート制限（簡易版）
  rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();

      const userRequests = requests.get(ip);
      if (!userRequests || now > userRequests.resetTime) {
        requests.set(ip, { count: 1, resetTime: now + windowMs });
      } else {
        userRequests.count++;
        if (userRequests.count > maxRequests) {
          return res.status(429).json({
            success: false,
            error: 'Too many requests'
          });
        }
      }
      next();
    };
  };
}
```

## 実装のポイント

### 1. トークン検証の流れ
1. **フロントエンド**: Google OAuthでアクセストークンを取得
2. **サーバー**: Google APIでトークンを検証し、ユーザー情報を取得
3. **サーバー**: ユーザー情報をDBに保存/更新
4. **サーバー**: JWTトークンを生成してフロントエンドに返す
5. **フロントエンド**: 以降のAPIリクエストでJWTトークンをAuthorization headerに含める

### 2. セキュリティ考慮事項
- JWT_SECRETは強力なランダム文字列を使用
- トークンの有効期限を適切に設定（24時間推奨）
- HTTPS通信の使用
- CORS設定の適切な構成
- レート制限の実装

### 3. エラーハンドリング
- Google API接続エラー
- 無効なトークン
- トークン期限切れ
- データベース接続エラー

### 4. パフォーマンス考慮事項
- トークン検証結果のキャッシュ
- データベース接続プールの使用
- 非同期処理の適切な実装 
