import {Context, Next} from 'koa';
import {JwtPayload, verify} from 'jsonwebtoken';
import logger from "../Utils/Logger";

module.exports = async (ctx: Context, next: Next): Promise<void> => {
  const token = ctx.request.headers.authorization as string;
  let jwtPayload = null;
  try {
    jwtPayload = verify(token.replace('Bearer ', ''), process.env.TOKEN_SECRET as string) as JwtPayload;
  } catch (e) {
    logger.info(e);
    ctx.status = 401;
    ctx.body = {message: "Invalid token"};
  }
  if (jwtPayload && jwtPayload.expirationTime > Date.now()) {
    ctx.jwtPayload = jwtPayload;
    ctx.state.userId = jwtPayload.userId;
    await next();
  } else {
    ctx.status = 401;
    ctx.body = {message: "Token is expired"};
  }
};
