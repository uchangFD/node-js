const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', (ctx) => {
  ctx.body = '홈';
});

router.get('/about/:name', (ctx) => {
  const { name } = ctx.params;
  ctx.body = `${name}의 소개`;
});

router.get('/posts', (ctx) => {
  const { id } = ctx.query;
  if (id) {
    ctx.body = `포스트 #${id}`;
    return;
  }

  ctx.body = '선택된 포스트가 없습니다.';
});

app.listen(4000, () => {
  console.log('Server is listening to port 4000');
});
