import { SignupUsecase } from "../../../src/usecase/auth/signup_usecase"
import { 
  createMockUserRepository, 
  createMockLogger, 
  createMockHash, 
  createSignupRequestBody,
  createMockUser 
} from "../../utils/test-helper"

describe("SignupUsecase", () => {
  let userRepo: ReturnType<typeof createMockUserRepository>
  let logger: ReturnType<typeof createMockLogger>
  let hash: ReturnType<typeof createMockHash>
  let signupUsecase: SignupUsecase

  beforeEach(() => {
    userRepo = createMockUserRepository()
    logger = createMockLogger()
    hash = createMockHash()
    signupUsecase = new SignupUsecase(userRepo, logger, hash)
  })

  describe("【正常系】", () => {
    test("有効なリクエストでユーザーが作成される", async () => {
      // Arrange
      const requestBody = createSignupRequestBody()
      userRepo.findOne.mockResolvedValue(null) // ユーザー名重複なし
      hash.passwordToHash.mockResolvedValue("hashedpassword123")

      // Act
      const result = await signupUsecase.exucute(requestBody, "api-token")

      // Assert
      expect(result.name).toBe(requestBody.name)
      expect(result.password).toBe("hashedpassword123")
      expect(result.gender).toBe(requestBody.gender)
      expect(result.profilePic).toContain(requestBody.name)
      expect(userRepo.save).toHaveBeenCalledWith(result)
      expect(hash.passwordToHash).toHaveBeenCalledWith(requestBody.password)
    })
  })

  describe("【異常系】", () => {
    test("パスワードが5文字未満の場合、エラーが発生する", async () => {
      // Arrange
      const requestBody = createSignupRequestBody({ password: "1234", confirmPassword: "1234" })

      // Act & Assert
      await expect(signupUsecase.exucute(requestBody, "api-token"))
        .rejects.toThrow("パスワードは5文字以上12文字以下である必要があります")
    })

    test("パスワードが12文字を超える場合、エラーが発生する", async () => {
      // Arrange
      const requestBody = createSignupRequestBody({ 
        password: "1234567890123", 
        confirmPassword: "1234567890123" 
      })

      // Act & Assert
      await expect(signupUsecase.exucute(requestBody, "api-token"))
        .rejects.toThrow("パスワードは5文字以上12文字以下である必要があります")
    })

    test("パスワードと確認パスワードが一致しない場合、エラーが発生する", async () => {
      // Arrange
      const requestBody = createSignupRequestBody({ 
        password: "password123", 
        confirmPassword: "different123" 
      })

      // Act & Assert
      await expect(signupUsecase.exucute(requestBody, "api-token"))
        .rejects.toThrow("パスワードが一致しません")
    })

    test("ユーザー名が重複している場合、エラーが発生する", async () => {
      // Arrange
      const requestBody = createSignupRequestBody()
      const existingUser = createMockUser("1", requestBody.name)
      userRepo.findOne.mockResolvedValue(existingUser)

      // Act & Assert
      await expect(signupUsecase.exucute(requestBody, "api-token"))
        .rejects.toThrow("ユーザー名が重複しています")
    })
  })
}) 
