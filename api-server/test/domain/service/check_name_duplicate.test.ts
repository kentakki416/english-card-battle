import { UserDomainService } from "../../../src/domain/service/user/check_name_duplicate"
import { createMockUserRepository, createMockUser } from "../../utils/test-helper"

describe("UserDomainService", () => {
  let userRepo: ReturnType<typeof createMockUserRepository>
  let userDomainService: UserDomainService

  beforeEach(() => {
    userRepo = createMockUserRepository()
    userDomainService = new UserDomainService(userRepo)
  })

  describe("【正常系】", () => {
    test("ユーザー名が重複していない場合、trueが返る", async () => {
      // Arrange
      userRepo.findOne.mockResolvedValue(null)

      // Act
      const result = await userDomainService.checkNameDuplicate("testuser")

      // Assert
      expect(result).toBe(true)
      expect(userRepo.findOne).toHaveBeenCalledWith({ name: "testuser" })
    })
  })

  describe("【異常系】", () => {
    test("ユーザー名が重複している場合、falseが返る", async () => {
      // Arrange
      const existingUser = createMockUser("1", "testuser")
      userRepo.findOne.mockResolvedValue(existingUser)

      // Act
      const result = await userDomainService.checkNameDuplicate("testuser")

      // Assert
      expect(result).toBe(false)
      expect(userRepo.findOne).toHaveBeenCalledWith({ name: "testuser" })
    })
  })
})
