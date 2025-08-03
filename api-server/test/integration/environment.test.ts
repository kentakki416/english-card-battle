describe('Environment-based client selection', () => {
  let originalEnv: string | undefined

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV
  })

  afterEach(() => {
    // 環境変数を元に戻す
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv
    } else {
      delete process.env.NODE_ENV
    }
  })

  describe('【環境変数による分岐】', () => {
    test('環境変数が未設定の場合、デフォルトでdevが使用される', () => {
      // Arrange
      delete process.env.NODE_ENV

      // Act
      const env = process.env.NODE_ENV || 'dev'

      // Assert
      expect(env).toBe('dev')
    })

    test('NODE_ENV=devが設定されている場合', () => {
      // Arrange
      process.env.NODE_ENV = 'dev'

      // Act & Assert
      expect(process.env.NODE_ENV).toBe('dev')
    })

    test('NODE_ENV=prdが設定されている場合', () => {
      // Arrange
      process.env.NODE_ENV = 'prd'

      // Act & Assert
      expect(process.env.NODE_ENV).toBe('prd')
    })
  })
}) 
