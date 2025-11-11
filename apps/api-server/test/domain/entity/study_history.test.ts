import { StudyHistory } from '../../../src/domain/entity/study_history'

describe('StudyHistory Entity', () => {
  describe('【正常系】', () => {
    test('有効なパラメータでエンティティが作成される', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = '507f1f77bcf86cd799439012'
      const word = 'deploy'
      const isCorrect = true
      const selectedAnswer = 'デプロイする'
      const correctAnswer = 'デプロイする'

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isSuccess()).toBe(true)
      const history = result.value
      expect(history.id).toBe(id)
      expect(history.userId).toBe(userId)
      expect(history.questionId).toBe(questionId)
      expect(history.word).toBe(word)
      expect(history.isCorrect).toBe(isCorrect)
      expect(history.selectedAnswer).toBe(selectedAnswer)
      expect(history.correctAnswer).toBe(correctAnswer)
    })

    test('不正解の履歴が作成される', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = '507f1f77bcf86cd799439012'
      const word = 'deploy'
      const isCorrect = false
      const selectedAnswer = '削除する'
      const correctAnswer = 'デプロイする'

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.value.isCorrect).toBe(false)
      expect(result.value.selectedAnswer).not.toBe(result.value.correctAnswer)
    })

    test('DBから復元できる', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = '507f1f77bcf86cd799439012'
      const word = 'deploy'
      const isCorrect = true
      const selectedAnswer = 'デプロイする'
      const correctAnswer = 'デプロイする'
      const studiedAt = new Date()

      // Act
      const result = StudyHistory.restoreFromDb(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer,
        studiedAt
      )

      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.value.studiedAt).toEqual(studiedAt)
    })
  })

  describe('【異常系】', () => {
    test('空のuserIdではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = ''
      const questionId = '507f1f77bcf86cd799439012'
      const word = 'deploy'
      const isCorrect = true
      const selectedAnswer = 'デプロイする'
      const correctAnswer = 'デプロイする'

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('空のquestionIdではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = ''
      const word = 'deploy'
      const isCorrect = true
      const selectedAnswer = 'デプロイする'
      const correctAnswer = 'デプロイする'

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('空のwordではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = '507f1f77bcf86cd799439012'
      const word = ''
      const isCorrect = true
      const selectedAnswer = 'デプロイする'
      const correctAnswer = 'デプロイする'

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('空のselectedAnswerではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = '507f1f77bcf86cd799439012'
      const word = 'deploy'
      const isCorrect = true
      const selectedAnswer = ''
      const correctAnswer = 'デプロイする'

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isFailure()).toBe(true)
    })

    test('空のcorrectAnswerではエンティティが作成できない', () => {
      // Arrange
      const id = '507f1f77bcf86cd799439011'
      const userId = 'user123'
      const questionId = '507f1f77bcf86cd799439012'
      const word = 'deploy'
      const isCorrect = true
      const selectedAnswer = 'デプロイする'
      const correctAnswer = ''

      // Act
      const result = StudyHistory.create(
        id,
        userId,
        questionId,
        word,
        isCorrect,
        selectedAnswer,
        correctAnswer
      )

      // Assert
      expect(result.isFailure()).toBe(true)
    })
  })
})

