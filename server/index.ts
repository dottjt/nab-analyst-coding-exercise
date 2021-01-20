import Koa, { Context } from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import axios from 'axios';
import bodyParser from 'koa-body';

const main = async () => {
  const app = new Koa();
  const router = new Router();

  router.get('/weather-search', async (ctx: Context) => {
    try {
      console.log(ctx.params);

      const response = await axios.get(
        `https://www.metaweather.com/api/location/search/?query=${ctx.params.location}`
      );

      console.log(response);
      
      ctx.status = 200;
      ctx.body = { response };
    } catch(e) {
      ctx.status = 404;
    }
  });

  app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(7777)
}

main();
