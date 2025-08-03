import { User, userBisinessRule } from '../../../src/domain/entity/user'

describe(__filename, () => {
  describe('【正常系', () => {
    test('ユーザーを作成できる', () => {
      const name = 'test'
      const password = 'testPassword'
      const gender = 'male'
      const profilePic = 'http://example.com/profile.jpg'

      const user = new User(name, password, gender, profilePic)

      expect(user.name).toBe(name)
      expect(user.password).toBe(password)
      expect(user.gender).toBe(gender)
      expect(user.profilePic).toBe(profilePic)
    })
  })

  describe('【異常系】', () => {
    test('ユーザー名が３文字未満の場合、エラーが発生する', () => {
      const failedName = 'aa'
      const password = 'testPassword'
      const gender = 'male'
      const profilePic = 'http://example.com/profile.jpg'

      expect(() => {new User(failedName, password, gender, profilePic)})
        .toThrow('ユーザー名は3文字以上8文字以下である必要があります')
    })

    test('ユーザー名が８文字を超える場合、エラーが発生する', () => {
      const failedName = 'aaaaaaaaa'
      const password = 'testPassword'
      const gender = 'male'
      const profilePic = 'http://example.com/profile.jpg'

      expect(() => {new User(failedName, password, gender, profilePic)})
        .toThrow('ユーザー名は3文字以上8文字以下である必要があります')
    })

    test('ハッシュ化される前のパスワードが５文字未満の場合、エラーが発生する', () => {
      const failedPassword = 'aaaa'

      expect(userBisinessRule.checkPasswordLength(failedPassword)).toBe(false)
    })

    test('ハッシュ化される前のパスワードが１２文字を超える場合、エラーが発生する', () => {
      const failedPassword = 'aaaaaaaaaaaaa'

      expect(userBisinessRule.checkPasswordLength(failedPassword)).toBe(false)
    })
  })
})
