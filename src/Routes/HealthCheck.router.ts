import Router from "koa-router";

const router = new Router();

router.get('/', async (ctx) => {
  ctx.redirect('/ping');
});
router.get('/ping', async (ctx) => {
  try {
    ctx.body = {
      message: 'pong pong'
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;
