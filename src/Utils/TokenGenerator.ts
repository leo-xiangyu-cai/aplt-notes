import jwt, {JwtPayload} from 'jsonwebtoken';

export class TokenGenerator {
  /**
   * Generate user token
   * User token will be expired after 15 minutes
   * User token will be able to refresh before 60 minutes after token is generated
   * @param userId
   * @return {string} token
   */
  static generateUserToken(userId: string): string {
    const currentTime = new Date();
    const expiredTime = new Date();
    expiredTime.setMinutes(currentTime.getMinutes() + 15);
    const refreshBefore = new Date();
    refreshBefore.setMinutes(currentTime.getMinutes() + 60);
    const secret = process.env.TOKEN_SECRET as string;
    return jwt.sign({
      userId: userId,
      expirationTime: expiredTime.getTime(),
      refreshBefore: refreshBefore.getTime(),
    }, secret);
  };

  /**
   * Refresh user token
   * @param token
   * @return {string | null} new token or null if token is invalid
   */
  static refreshToken(token: string): string | null {
    try {
      const jwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
      if (jwtPayload && jwtPayload.refreshBefore > Date.now()) {
        return this.generateUserToken(jwtPayload.userId as string);
      }
      return null;
    } catch {
      return null;
    }
  };

}
