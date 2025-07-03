const express = require('express');

const router = express.Router();

const BatchController = require('../controllers/batch.controller.js');
const TranController = require('../controllers/transaction.controller.js');
const SepaController = require('../controllers/cepa.controller.js');
router.get('/', (req, res, next) => {
    res.send('Payment Gateway API V1.0');
});

/* batch */
router.get('/Batch', BatchController.GetBatch);
//router.post('/api/Batch', BatchController.CreateBatch);
router.put('/Batch', BatchController.UpdateBatch);
router.delete('/Batch', BatchController.DeleteBatch);
router.get('/Batch/:_id', BatchController.GetBatchById);
router.post('/CreateBatch/:_id', BatchController.CreateBatchByPVId);
router.post('/Batch/CreateBatchMulti', BatchController.CreateBatchMulti);
/* transaction */
router.get('/Transaction', TranController.GetTransaction);
router.post('/Transaction', TranController.CreateTransaction);
router.put('/Transaction/:_id', TranController.UpdateTransaction);
router.delete('/Transaction/:_id', TranController.DeleteTransaction);
router.get('/Transaction/:_id', TranController.GetTransactionById);
/* cepa */
router.get('/Cepa/Process/:_id', SepaController.Process);
module.exports = router;