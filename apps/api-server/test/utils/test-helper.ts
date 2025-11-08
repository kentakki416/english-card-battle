import { User } from '../../src/domain/entity/user'
import { IUserRepository } from '../../src/infrastructure/db/repository/user_repository'
import { ILogger } from '../../src/infrastructure/log/logger'
import { IHash } from '../../src/infrastructure/util/hash'
import { IToken } from '../../src/infrastructure/util/jwt'

// テスト用のモックユーザーデータ
export const createMockUser = (_id = '1', name = 'testuser'): User => {
  // _idは将来のID機能拡張のため保持
  void _id
  return new User(name, 'hashedpassword', 'male', 'http://example.com/profile.jpg')
}

// UserRepositoryのモック
export const createMockUserRepository = (): jest.Mocked<IUserRepository> => {
  return {
    save: jest.fn().mockResolvedValue(undefined),
    findOne: jest.fn(),
  }
}

// Loggerのモック
export const createMockLogger = (): jest.Mocked<ILogger> => {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
}

// Hashのモック
export const createMockHash = (): jest.Mocked<IHash> => {
  return {
    passwordToHash: jest.fn().mockResolvedValue('hashedpassword'),
    confirmPassword: jest.fn().mockResolvedValue(true),
  }
}

// Tokenのモック
export const createMockToken = (): jest.Mocked<IToken> => {
  return {
    generateToken: jest.fn().mockReturnValue('mock-token'),
  }
}

// テスト用のリクエストボディ
export const createSignupRequestBody = (overrides = {}) => {
  return {
    name: 'testuser',
    password: 'password123',
    confirmPassword: 'password123',
    gender: 'male',
    ...overrides,
  }
} 
