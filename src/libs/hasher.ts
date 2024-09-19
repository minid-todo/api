export const Hasher = {
  async hashPassword(password: string): Promise<string> {
    const hash = await Bun.password.hash(password, {
      algorithm: 'argon2d',
      memoryCost: 4,
      timeCost: 3,
    });
    return hash;
  },

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return Bun.password.verify(password, hashedPassword, 'argon2d');
  },

  async sha256(text: string) {
    const hasher = new Bun.CryptoHasher('sha256');
    hasher.update(text);
    return hasher.digest('hex');
  },
};
