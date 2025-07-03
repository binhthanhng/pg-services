var mongoose = require('mongoose');
require("../models/Transaction");
var Transaction = mongoose.model('Transaction');
var Schema = require('../schema/ValidateTransaction.json');
var queryParser = require('../db/queryParser');
const tv4 = require('tv4');
var transactionValidate = require('../models/transactionValidate.class');
var utils = require('../services/util.services');
class TransactionService {
    static async GetTransaction(req, res) {
        var queryOptions = queryParser(req);
        if (!queryOptions.$top) {
            queryOptions.$top = 20;
        }
        queryOptions.$filter = queryOptions.$filter || {};

        var qr = Transaction
            .find(queryOptions.$filter)
            .select(queryOptions.$select)
            .limit(queryOptions.$top)
            .skip(queryOptions.$skip)
            .sort(queryOptions.$sort);

        qr.exec((err, data) => {
            if (err) {
                res.status(400).send({ error: 'Transaction not found. ' + err });
                return;
            }
            if (queryOptions.$count || queryOptions.$inlinecount) {
                Transaction.count(queryOptions.$filter).exec((err, c) => {
                    var cc = 0;
                    if (!err) { cc = c; }

                    res.send({
                        "@odata.context": "Transaction",
                        "@odata.count": cc,
                        value: data
                    });
                });
            }
            else {
                res.send({
                    "@odata.context": "Transaction",
                    value: data
                });
            }
        })
    }
    static async CreateTransaction(req, res) {
        let data = req.body
        if (utils.isUndefinedNullEmpty(data)) {
            res.status(400).send({ error: 'Missing body' });
        } else {
            var newTran = new Transaction()
            newTran.TranRef = data.ref
            newTran.BeneName = data.beneficiaryName
            newTran.BeneAccount = data.beneficiaryBankAccount
            newTran.BeneBankName = data.beneficiaryBankName
            newTran.BeneBranchName = data.beneficiaryBranchName
            newTran.BeneBankCitadCode = data.beneficiaryCitadCode
            newTran.BeneBankSwiftIbanCode = data.beneficiarySwiftCode
            newTran.Currenry = data.currencyId.code
            newTran.PaymentAmount = data.amount
            newTran.Description = data.description
            newTran.TranStatus = 'Ready'
            newTran.PaymentType = data.paymentType
            newTran.Method = data.method
            newTran.PayeeType = data.payeeType
            newTran.Budget = data.budget
            newTran.FundType = data.fundType
            newTran.BatchId = data.batchId
            newTran.PVTranId = data.tranId
            newTran.PVBatchId = data.batchIdPV
            newTransaction.save((err, data) => {
                if (err) {
                    res.status(400).send({ error: 'Can not add Transaction. ' + err });
                    return;
                }
                res.send({
                    "@odata.context": `Transaction`,
                    value: data
                });
            })
        }
    }
    static async CreateTransactionByPVId(data, batchId, batchIdPV) {
        try {
            var validateObj = new transactionValidate()
            validateObj.BeneName = data.beneficiaryName
            validateObj.BeneBankName = data.beneficiaryBankName
            validateObj.BeneAccount = data.beneficiaryBankAccount
            validateObj.Description = data.description
            var valid = tv4.validateResult(validateObj, Schema, true, true);
            if (valid) {
                var newTran = new Transaction()
                newTran.TranRef = data.ref
                newTran.BeneName = data.beneficiaryName
                newTran.BeneAccount = data.beneficiaryBankAccount
                newTran.BeneBankName = data.beneficiaryBankName
                newTran.BeneBranchName = data.beneficiaryBranchName
                newTran.BeneBankCitadCode = data.beneficiaryCitadCode
                newTran.BeneBankSwiftIbanCode = data.beneficiarySwiftCode
                newTran.Currenry = data.currencyId.code
                newTran.PaymentAmount = data.amount
                newTran.Description = data.description
                newTran.TranStatus = 'Ready'
                newTran.PaymentType = data.paymentType
                newTran.Method = data.method
                newTran.PayeeType = data.payeeType
                newTran.Budget = data.budget
                newTran.FundType = data.fundType
                newTran.BatchId = batchId
                newTran.PVTranId = data._id
                newTran.PVBatchId = batchIdPV
                await newTran.save();
                return newTran;
            } else {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
    static async UpdateTransaction(req, res) {
        let _id = req.params._id
        let body = req.body
        if (!utils.isUndefinedNullEmpty(_id)) {
            if (!utils.isUndefinedNullEmpty(body)) {
                Transaction.findById(_id, (err, data) => {
                    if (err) {
                        res.status(400).send({ error: `Can't update Transaction with id: ${_id} ${err}` });
                        return;
                    }
                    for (prop in body) {
                        data[prop] = body[prop]
                    }
                    data.save((error, updateData) => {
                        if (err) {
                            error.status(400).send({ error: 'Can not update Transaction. ' + error });
                            return;
                        }
                        res.send({
                            "@odata.context": `Transaction`,
                            value: updateData
                        });
                    })
                })
            } else {
                res.status(400).send({ error: `Missing body` });
            }
        } else {
            res.status(400).send({ error: `Missing id` });
        }
    }
    static async DeleteTransaction(req, res) {
        let _id = req.params._id
        if (!utils.isUndefinedNullEmpty(_id)) {
            Transaction.findByIdAndDelete(_id, (err, data) => {
                if (err) {
                    res.status(400).send({ error: `Can't delete Transaction with id: ${_id} ${err}` });
                    return;
                }
                res.send("Deleted");
            })
        } else {
            res.status(400).send({ error: `Missing id` });
        }
    }
    static async GetTransactionById(req, res) {
        let _id = req.params._id
        if (!utils.isUndefinedNullEmpty(_id)) {
            Transaction.findById(_id, (err, data) => {
                if (err) {
                    res.status(400).send({ error: `Can't find Transaction with id: ${_id} ${err}` });
                    return;
                }
                res.send({
                    "@odata.context": `Transaction`,
                    value: data
                });
            })
        } else {
            res.status(400).send({ error: `Missing id` });
        }
    }
}

module.exports = TransactionService;