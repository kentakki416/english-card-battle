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
