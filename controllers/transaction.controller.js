var TranService = require('../services/transaction.services');
module.exports = {
  async GetTransaction(req, res) {
    let Tran = await TranService.GetTransaction(req, res);
  },
  async CreateTransaction(req, res) {
    let Tran = await TranService.CreateTransaction(req, res);
  },
  async UpdateTransaction(req, res) {
    let Tran = await TranService.UpdateTransaction(req, res);
  },
  async DeleteTransaction(req, res) {
    let Tran = await TranService.DeleteTransaction(req, res);
  },
  async GetTransactionById(req, res) {
    let Tran = await TranService.GetTransactionById(req, res);
  },

};