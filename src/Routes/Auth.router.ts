import Router from "koa-router";
import {SignUpRequest} from "../Request/SignUpRequest";
import {UserEntity} from "../DataSource/Entities/User.entity";
import UserDbModel from "../DataSource/Models/User.db.model";
import {TokenGenerator} from "../Utils/TokenGenerator";
import {SingInRequest} from "../Request/SignInRequest";
import {HashingService} from "../Utils/HashingService";

const router = new Router();

router.post('/sign-up', async (ctx) => {
  const addNoteRequest = new SignUpRequest(ctx.request.body);
  const user = await UserDbModel.getByUsername(addNoteRequest.username);
  if (user) {
    ctx.status = 400;
    ctx.body = {
      message: 'Username already exists',
    }
  } else {
    let newUser = new UserEntity(addNoteRequest.username, HashingService.hashText(addNoteRequest.password));
    let newRegisteredUser = await UserDbModel.create(newUser);
    if (newRegisteredUser) {
      ctx.status = 201;
      ctx.body = {
        message: 'success',
        data: {
          token: TokenGenerator.generateUserToken(newRegisteredUser.id)
        }
      }
    } else {
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error',
      }
    }
  }
});

router.post('/sign-in', async (ctx) => {
  const singInRequest = new SingInRequest(ctx.request.body);
  const user = await UserDbModel.getByUsername(singInRequest.username);
  if (user) {
    if (user.password === HashingService.hashText(singInRequest.password)) {
      ctx.body = {
        message: 'success',
        data: {
          token: TokenGenerator.generateUserToken(user.id)
        }
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        message: 'Invalid password',
      }
    }
  }
});

export default router;
