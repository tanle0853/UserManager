import bcrypt from 'bcrypt';

export class Password {
  static async hash(password: string): Promise<string> {
    const saltRounds = 10; // Số vòng lặp để tạo salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
