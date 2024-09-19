import { sign, verify } from 'hono/jwt';
import { type JWTPayload, JwtTokenExpired } from 'hono/utils/jwt/types';
import { jwtSecret } from '../configs';
import { Hasher } from './hasher';

interface IPayload extends JWTPayload {
  sub: string; // User ID
  email: string;
  iss: string;
  token_use: string;
}

export class JWT {
  private alg: string;
  private exp: number;

  constructor() {
    const dt = Math.floor(Date.now() / 1000);
    this.alg = 'HS256';
    this.exp = dt + 60 * 60;
  }

  private async genSecret() {
    return await Hasher.sha256(jwtSecret);
  }

  public async sign(payload: IPayload): Promise<string> {
    const secret = await this.genSecret();
    const data = {
      ...payload,
      exp: this.exp,
    };
    const jwt = await sign(data, secret);
    return jwt;
  }

  public async verify(
    token: string,
  ): Promise<{ status: boolean; message: string; data?: IPayload }> {
    const secret = await this.genSecret();

    try {
      const payload = (await verify(token, secret)) as IPayload;
      return { status: true, message: 'Success', data: payload };
    } catch (error) {
      let message = 'Forbidden';
      if (error instanceof JwtTokenExpired) {
        message = 'Token expired';
      }
      return { status: false, message };
    }
  }
}
