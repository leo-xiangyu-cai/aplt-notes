import Router from "koa-router";

const router = new Router();

router.get('/', async (ctx) => {
  try {
    ctx.body = {
      message: 'Appolution Notes API is running!!!!!'
    }
  } catch (e) {
    console.error(e);
  }
});
router.get('/ping', async (ctx) => {
  try {
    ctx.body = {
      message: 'pong pong pong'
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;
