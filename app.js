const uaParse = require('ua-parser-js');
const router = require('koa-router')();
const path = require('path');
const Koa = require('koa');
const app = new Koa();

router.get('/', async ctx => {
  const ua = new uaParse(ctx.headers['user-agent']);
  const os = ua.getOS();
  const browser = ua.getBrowser();

  const ipaddress = ctx.ip;
  const language = ctx.headers['accept-language'].substr(0, 5);
  const software = `${os.name} ${os.version} (${browser.name} ${browser.version})`;

  ctx.body = JSON.stringify({ ipaddress, language, software });
});

app.use(router.routes());

app.use(async function pageNotFound(ctx) {
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

app.listen(3000);
