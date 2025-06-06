import type { IUserRepository } from '../../src/adapter/interface/repository/iuser_repository'
import type { ILogger } from '../../src/adapter/interface/ilogger'
import type { IHash } from '../../src/adapter/interface/ihash'
import type { IToken } from '../../src/adapter/interface/itoken'
import { User } from '../../src/domain/entity/user'

// テスト用のモックユーザーデータ
export const createMockUser = (_id = '1', name = 'testuser'): User => {
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
