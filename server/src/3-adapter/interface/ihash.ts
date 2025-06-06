export interface IHash {
  passwordToHash: (_password: string) => Promise<string>
  confirmPassword: (_password: string, _hashedPassword: string) => Promise<boolean>
}
