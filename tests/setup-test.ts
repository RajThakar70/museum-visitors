import FastifyApp from '../src/infrastructure/providers/FastifyApp';

before(async function () {
  // remove timeout
  // this.timeout(0);
  console.log(`----------------- Test Init -----------------`);
  // await Database.init();
  // console.log(`----------------- DB Started ----------------`);
  // await FastifyApp.fastifyServer.ready();
});

after(async function () {
  // remove timeout
  // this.timeout(0);
  // console.log(`------------------ Stop DB ------------------`);
  // await Database.closeConnection();
  // console.log(`----------------- Stop Queue ----------------`);
  // await ExecutionReportQueue.terminateQueue();
  // await FastifyApp.fastifyServer.io.close();
  console.log(`----------------- Stop Test -----------------`);
});

