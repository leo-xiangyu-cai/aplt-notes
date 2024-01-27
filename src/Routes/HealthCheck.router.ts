import Router from "koa-router";

const router = new Router();

router.get('/ping', async (ctx) => {
  try {
    ctx.body = {
      message: 'pong'
    }
  } catch (e) {
    console.error(e);
  }
});

router.get('/health', async (ctx) => {
  try {
    ctx.body = {
      message: 'OK'
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;
