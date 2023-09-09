import bcrypt from 'bcrypt';

export class Password {
  static async hash(password: string): Promise<string> {
    try {
      const saltRounds = 10; // Số vòng lặp để tạo salt
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password: ${error}`);
    }
  }

  static async verify(userInputPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(userInputPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error}`);
    }
  }
}
