var mongoose = require('mongoose');
require("../models/Batch");
require("../models/Transaction");
var Batch = mongoose.model('Batch');
var Transaction = mongoose.model('Transaction');
var CepaService = require('../services/cepa.services');
var utils = require('../services/util.services');
module.exports = {
  async Process(req, res) {
    let _id = req.params._id
    Batch.findById(_id, (err, dataBatch) => {
      if (err) {
        res.status(400).send({ error: `Can't find Batch with id: ${_id} ${err}` });
        return;
      }
      if (dataBatch == null) {
        res.status(400).send({ error: `Can't find Batch with id: ${_id} ${err}` });
        return;
      }
      Transaction.find({ BatchId: _id })
        .then(trans => {
          if (trans) {
            if (trans == null || trans.length == 0) {
              res.status(400).send({ error: 'Can not find Transaction. ' + error });
              return;
            }
            dataBatch['Status'] = 'Processing';
            dataBatch.save((error, updateDataBatch) => {
              if (error) {
                error.status(400).send({ error: 'Update batch fail ' + error });
                return;
              }
              trans.forEach(tran => {
                tran['PGRef'] = utils.createBankRef('SCB');
                tran['TranStatus'] = 'Processing';
                tran.save();
              });
              let createXML = CepaService.createXmlValidate(dataBatch, trans, false);

            })

          } else {
            console.log('User not found');
          }
        })
        .catch(err => {
          console.error('Error finding user:', err);
        });
      //console.log('bank ref: ' + refff);
      res.status(200).send();
    })
  },
};