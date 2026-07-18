import bcrypt from "bcrypt";

export class PasswordHashingService {
    private readonly SALT_ROUNDS = 10;

    public async hashPassword(plainPassword: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
        return hashedPassword;
    }

    public async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    }
}