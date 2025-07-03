var BatchService = require('../services/batch.services');
module.exports = {
  async GetBatch(req, res) {
    let Batch = await BatchService.GetBatch(req, res);
  },
  async CreateBatch(req, res) {
    let Batch = await BatchService.CreateBatch(req, res);
  },
  async UpdateBatch(req, res) {
    let Batch = await BatchService.UpdateBatch(req, res);
  },
  async DeleteBatch(req, res) {
    let Batch = await BatchService.DeleteBatch(req, res);
  },
  async GetBatchById(req, res) {
    let Batch = await BatchService.GetBatchById(req, res);
  },
   async CreateBatchByPVId(req, res) {
    let Batch = await BatchService.CreateBatchByPVId(req, res);
  },
   async CreateBatchMulti(req, res) {
    let Batch = await BatchService.CreateBatchMulti(req, res);
  },
};