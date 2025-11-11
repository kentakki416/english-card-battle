import { EnglishWord, englishWordBusinessRule } from '../../../src/domain/entity/english_word'

describe('EnglishWord Entity', () => {
  describe('【正常系】', () => {
    test('有効なパラメータでエンティティが作成される', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = 'deploy'
      const correctAnswer = 'デプロイする'
      const choices = ['デプロイする', '削除する', '追加する', 'コミットする']
      const difficulty = 3
      const category = 'development'

      // Act
      const result = EnglishWord.create(id, word, correctAnswer, choices, difficulty, category)

      // Assert
      expect(result.isSuccess()).toBe(true)
      const englishWord = result.value
      expect(englishWord.id).toBe(id)
      expect(englishWord.word).toBe(word)
      expect(englishWord.correctAnswer).toBe(correctAnswer)
      expect(englishWord.choices).toEqual(choices)
      expect(englishWord.difficulty).toBe(difficulty)
      expect(englishWord.category).toBe(category)
    })

    test('正解判定が正しく動作する', () => {
      // Arrange
      const word = EnglishWord.create(
        '507f1f77bcf86cd799439011',
        'deploy',
        'デプロイする',
        ['デプロイする', '削除する', '追加する', 'コミットする'],
        3,
        'development'
      ).value

      // Act & Assert
      expect(word.isCorrectAnswer('デプロイする')).toBe(true)
      expect(word.isCorrectAnswer('削除する')).toBe(false)
    })

    test('DBから復元できる', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = 'deploy'
      const correctAnswer = 'デプロイする'
      const choices = ['デプロイする', '削除する', '追加する', 'コミットする']
      const difficulty = 3
      const category = 'development'
      const createdAt = new Date()

      // Act
      const result = EnglishWord.restoreFromDb(
        id,
        word,
        correctAnswer,
        choices,
        difficulty,
        category,
        createdAt
      )

      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.value.createdAt).toEqual(createdAt)
    })
  })

  describe('【異常系】', () => {
    test('空の英単語ではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = ''
      const correctAnswer = 'デプロイする'
      const choices = ['デプロイする', '削除する']

      // Act
      const result = EnglishWord.create(id, word, correctAnswer, choices)

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('空の正解ではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = 'deploy'
      const correctAnswer = ''
      const choices = ['デプロイする', '削除する']

      // Act
      const result = EnglishWord.create(id, word, correctAnswer, choices)

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('選択肢が2つ未満ではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = 'deploy'
      const correctAnswer = 'デプロイする'
      const choices = ['デプロイする']

      // Act
      const result = EnglishWord.create(id, word, correctAnswer, choices)

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('選択肢に正解が含まれていない場合はエラー', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = 'deploy'
      const correctAnswer = 'デプロイする'
      const choices = ['削除する', '追加する']

      // Act
      const result = EnglishWord.create(id, word, correctAnswer, choices)

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('選択肢に重複がある場合はエラー', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const word = 'deploy'
      const correctAnswer = 'デプロイする'
      const choices = ['デプロイする', 'デプロイする']

      // Act
      const result = EnglishWord.create(id, word, correctAnswer, choices)

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('難易度が1未満の場合はエラー', () => {
      // Arrange
      const result = englishWordBusinessRule.validateDifficulty(0)

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('難易度が5を超える場合はエラー', () => {
      // Arrange
      const result = englishWordBusinessRule.validateDifficulty(6)

      // Assert
      expect(result.isFailure()).toBe(true)
    })
  })
})

