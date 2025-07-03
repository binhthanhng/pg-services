const { createBullBoard } = require('@bull-board/api');
const { ExpressAdapter } = require('@bull-board/express');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const express = require('express');
var queuesRouter = express.Router();
const Queue = require('bull');

const PopulateTransactionQueue = new Queue('PopulateTransactionQueue');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');


const queues = [
  new BullAdapter(PopulateTransactionQueue, { description: 'Test 123' }),
];

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: queues,
  serverAdapter: serverAdapter,
});

queuesRouter = serverAdapter.getRouter();

/* GET Add job. */
queuesRouter.get('/add/:queueName', async function (req, res, next) {
  var svcName = req.params.queueName;
  var queue = new Queue(svcName);

  const job = await queue.add(req.query || { name: svcName }); 
  return res.send({ jobId: job.id });
});

/* GET Add job. */
queuesRouter.get('/cancel/:queueName/:jobid', async function (req, res, next) {
  var svcName = req.params.queueName;
  var jobid = req.params.jobid;
  var queue = new Queue(svcName);

  var job = await queue.getJob(jobid); 
  await job.moveToFailed("Admin cancel");
  return res.send({ jobId: job.id });
});

queuesRouter.get('/config/:queueName/', async function (req, res, next) {
  var svcName = req.params.queueName;
  var type = req.params.type;
  var queue = new Queue(svcName);

  var workers = queue.getWorkers();
  return res.send(workers);
});

queuesRouter.get('/clean/:queueName/:grace/:limit', async function (req, res, next) {
  var svcName = req.params.queueName;
  var grace = req.params.grace;
  var limit = req.params.limit;
  var queue = new Queue(svcName);

   await queue.clean(Number.parseInt(grace), 'wait', Number.parseInt(limit));
  return res.send('ok');
});

/* GET remove and stop active job. */
queuesRouter.get('/remove/:queueName', async function (req, res, next) {
  var qName = req.params.queueName;
  var q = new Queue(qName);
  q.pause();
  var i = await q.getActive().then(function (jobs) {
    for (var job of jobs) {
      job.remove();
    }
  });

  return res.send(i);
});


module.exports = queuesRouter;
