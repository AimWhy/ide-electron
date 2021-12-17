
// tslint:disable no-console
import * as net from 'net';
import * as yargs from 'yargs';
import { Deferred } from '@opensumi/ide-core-common';
import { IServerAppOpts, ServerApp, NodeModule } from '@opensumi/ide-core-node';

export async function startServer(arg1: NodeModule[] | Partial<IServerAppOpts>) {
  const deferred = new Deferred<net.Server>();
  let opts: IServerAppOpts = {
    webSocketHandler: [],
    marketplace: {
      showBuiltinExtensions: true,
      accountId: 'nGJBcqs1D-ma32P3mBftgsfq',
      masterKey: '-nzxLbuqvrKh8arE0grj2f1H',
    },
    // TODO 临时方案，传递外层 中间件函数
  };
  if (Array.isArray(arg1)) {
    opts = {
      ...opts,
      modulesInstances: arg1,
    };
  } else {
    opts = {
      ...opts,
      ...arg1,
    };
  }

  const server = net.createServer();
  const listenPath = yargs.argv.listenPath;
  console.log('listenPath', listenPath);

  const serverApp = new ServerApp(opts);

  await serverApp.start(server);

  server.on('error', (err) => {
    deferred.reject(err);
    console.error('server error: ' + err.message);
    setTimeout(process.exit, 0, 1);
  });

  server.listen(listenPath, () => {
    console.log(`server listen on path ${listenPath}`);
    deferred.resolve(server);
  });

  await deferred.promise;
}
