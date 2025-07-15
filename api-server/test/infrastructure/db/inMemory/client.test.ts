import { InMemoryClient } from "../../../../src/infrastructure/db/inMemory/client"
import { createMockLogger } from "../../../utils/test-helper"

describe("InMemoryClient", () => {
  let logger: ReturnType<typeof createMockLogger>
  let client: InMemoryClient

  beforeEach(() => {
    logger = createMockLogger()
    client = new InMemoryClient(logger)
  })

  describe("【基本動作】", () => {
    test("connectメソッドは成功し、ログを出力する", async () => {
      // Act
      await client.connect()

      // Assert
      expect(logger.info).toHaveBeenCalledWith("InMemory client connected (no external connection)")
    })

    test("closeメソッドは成功し、ログを出力する", async () => {
      // Act
      await client.close()

      // Assert
      expect(logger.info).toHaveBeenCalledWith("InMemory client closed (no external connection)")
    })

    test("getDbメソッドは常にnullを返す", () => {
      // Act
      const db1 = client.getDb("testdb1")
      const db2 = client.getDb("another-db")

      // Assert
      expect(db1).toBeNull()
      expect(db2).toBeNull()
    })

    test("connect/closeの順序で実行しても正常に動作する", async () => {
      // Act
      await client.connect()
      await client.close()

      // Assert
      expect(logger.info).toHaveBeenCalledWith("InMemory client connected (no external connection)")
      expect(logger.info).toHaveBeenCalledWith("InMemory client closed (no external connection)")
      expect(logger.info).toHaveBeenCalledTimes(2)
    })
  })
}) 
