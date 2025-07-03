const Queue = require('bull');
var mongoose = require('mongoose');
require("../models/Batch");
require("../models/Transaction");
var Batch = mongoose.model('Batch');
var utils = require('../services/util.services');
var axios = require('axios');
var queryParser = require('../db/queryParser');
var TransactionService = require('../services/transaction.services');
const http = require('http');
const https = require('https');
require('../bullMQ/PopulateTransactionQueue');

var PopulateTransactionQueue = new Queue('PopulateTransactionQueue');

const instance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
});

class BatchService {
    static async GetBatch(req, res) {
        var queryOptions = queryParser(req);
        if (!queryOptions.$top) {
            queryOptions.$top = 20;
        }
        queryOptions.$filter = queryOptions.$filter || {};

        var qr = Batch
            .find(queryOptions.$filter)
            .select(queryOptions.$select)
            .limit(queryOptions.$top)
            .skip(queryOptions.$skip)
            .sort(queryOptions.$sort);

        qr.exec((err, data) => {
            if (err) {
                res.status(400).send({ error: 'Batch not found. ' + err });
                return;
            }
            if (queryOptions.$count || queryOptions.$inlinecount) {
                Batch.count(queryOptions.$filter).exec((err, c) => {
                    var cc = 0;
                    if (!err) { cc = c; }

                    res.send({
                        "@odata.context": "Batch",
                        "@odata.count": cc,
                        value: data
                    });
                });
            }
            else {
                res.send({
                    "@odata.context": "Batch",
                    value: data
                });
            }
        })
    }
    static async CreateBatch(req, res) {
        let body = req.body
        if (utils.isUndefinedNullEmpty(body)) {
            res.status(400).send({ error: 'Missing body' });
        } else {
            var newBatch = new Batch()
            newBatch.BatchRef = body.BatchRef
            newBatch.save((err, data) => {
                if (err) {
                    res.status(400).send({ error: 'Can not add Batch. ' + err });
                    return;
                }
                res.send({
                    "@odata.context": `Batch`,
                    value: data
                });
            })
        }
    }
    static async UpdateBatch(req, res) {
        let _id = req.params._id
        let body = req.body
        if (!utils.isUndefinedNullEmpty(_id)) {
            if (!utils.isUndefinedNullEmpty(body)) {
                Batch.findById(_id, (err, data) => {
                    if (err) {
                        res.status(400).send({ error: `Can't update Batch with id: ${_id} ${err}` });
                        return;
                    }
                    for (prop in body) {
                        data[prop] = body[prop]
                    }
                    data.save((error, updateData) => {
                        if (err) {
                            error.status(400).send({ error: 'Can not update Batch. ' + error });
                            return;
                        }
                        res.send({
                            "@odata.context": `Batch`,
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
    static async DeleteBatch(req, res) {
        let _id = req.params._id
        if (!utils.isUndefinedNullEmpty(_id)) {
            Batch.findByIdAndDelete(_id, (err) => {
                if (err) {
                    res.status(400).send({ error: `Can't delete Batch with id: ${_id} ${err}` });
                    return;
                }
                res.send("Deleted");
            })
        } else {
            res.status(400).send({ error: `Missing id` });
        }
    }
    static async GetBatchById(req, res) {
        let _id = req.params._id
        if (!utils.isUndefinedNullEmpty(_id)) {
            Batch.findById(_id, (err, data) => {
                if (err) {
                    res.status(400).send({ error: `Can't find Batch with id: ${_id} ${err}` });
                    return;
                }
                res.send({
                    "@odata.context": `Batch`,
                    value: data
                });
            })
        } else {
            res.status(400).send({ error: `Missing id` });
        }
    }
    static async CreateBatchByPVId(req, res) {
        try {
            var jobOpts = {
                removeOnComplete: 50,
            };
            let jobData = {
                _PVid: req.params._id
            };
            var jobPopulateTransactionQueue = await PopulateTransactionQueue.add(jobData, jobOpts);
            console.log(jobPopulateTransactionQueue.id);
            // let _PVid = req.params._id
            // let dataBatch = await GetBatchPV(_PVid);
            // if (dataBatch != null) {
            //     console.log('get batch succcess');
            //     let isCreateBatch = await CreateBatchPG(dataBatch);
            //     if (isCreateBatch) {
            //         console.log('create batch succcess');
            //         let dataTrans = await GetTransactionByIdPV(_PVid);

            //         if (dataTrans.value.length > 0) {
            //             console.log('get transaction succcess');
            //             for (const index in dataTrans.value) {
            //                 let isCreateTran = await TransactionService.CreateTransactionByPVId(dataTrans.value[index], isCreateBatch._id.toString(), _PVid);
            //                 if (isCreateTran) {
            //                     res.status(200).send('Create Success');
            //                 }
            //             }
            //         } else {
            //             res.status(400).send('Get transaction is null');
            //         }
            //     }
            // }
        }
        catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
    static async CreateBatchMulti(req, res) {
        try {
            let body = req.body
            if (!utils.isUndefinedNullEmpty(body)) {
                for (const indexBatch in body.BatchListId) {
                    console.log('process batchId' + body.BatchListId[indexBatch]);
                    let _PVid = body.BatchListId[indexBatch];
                    let dataBatch = await GetBatchPV(_PVid);
                    if (dataBatch != null) {
                        console.log('get batch succcess');
                        let isCreateBatch = await CreateBatchPG(dataBatch);
                        if (isCreateBatch) {
                            console.log('create batch succcess');
                            let dataTrans = await GetTransactionByIdPV(_PVid);

                            if (dataTrans.value.length > 0) {
                                console.log('get transaction succcess');
                                for (const index in dataTrans.value) {
                                    let isCreateTran = await TransactionService.CreateTransactionByPVId(dataTrans.value[index], isCreateBatch._id.toString(), _PVid);
                                    if (isCreateTran) {
                                        res.status(200).send('Create Success');
                                    }
                                }
                            } else {
                                res.status(400).send('Get transaction is null');
                            }
                        }
                    }
                }
            } else {
                res.status(400).send({ error: `Missing body` });
            }

        }
        catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
    static async UpdateBatchByID(req, res) {
        let _id = req.params._id
        if (!utils.isUndefinedNullEmpty(_id)) {
            Batch.findById(_id, (err, data) => {
                if (err) {
                    res.status(400).send({ error: `Can't update Batch with id: ${_id} ${err}` });
                    return;
                }
                data['Status'] = 'Ready';
                data.save((error, updateData) => {
                    if (err) {
                        error.status(400).send({ error: 'Can not update Batch. ' + error });
                        return;
                    }
                    res.send({
                        value: updateData
                    });
                })
            })
        }
        else {
            res.status(400).send({ error: `Missing id` });
        }
    }
}
async function GetBatchPV(_PVid) {
    var backendUrl = "https://p2p-qa.appvity.com";
    var select = "?$select=ref,name,totalTransaction, currencyId, amount, debitAccountId, statusId, localCharge, requestedExecutionDate, gatewayMethod";
    var url = `${backendUrl}/api/v2/eBankTransfer/batch/${_PVid}${select}`;
    var apikey = 'H5fw2BtgS5mPQ/jEdqZOkT1mZxbI5vuq5GH0cYcOc1gW5z+FBid/nZjMlzFAdTwKhOm+E8KMO1Z2a+r6PqqCSw=='
    var headers = {
        "Accept": "application/json",
        "x-appvity-apikey": apikey,
    };
    try {
        var response = await axios.get(url, {
            headers: headers
        });
        return response.data;
    } catch (err) {
        console.log(' --> Error: ', err.message);
        return null;
    }
}
async function GetTransactionByIdPV(_PVid) {
    var backendUrl = "https://p2p-qa.appvity.com";
    var select = `?$select=ref,refHTML,description,beneficiaryName,beneficiaryBankAccount,beneficiaryBankName,beneficiaryBranchName,beneficiaryCitadCode,beneficiarySwiftCode,currencyId,amount,paymentType,method,payeeType,budget,fundType,source,batchId,pgRef,statusMessage&$filter=batchId eq '${_PVid}'`;
    var url = `${backendUrl}/api/v2/eBankTransfer/transaction${select}`;
    var apikey = 'H5fw2BtgS5mPQ/jEdqZOkT1mZxbI5vuq5GH0cYcOc1gW5z+FBid/nZjMlzFAdTwKhOm+E8KMO1Z2a+r6PqqCSw=='
    var headers = {
        "Accept": "application/json",
        "x-appvity-apikey": apikey,
    };
    try {
        var response = await instance.get(url, {
            headers: headers
        });
        return response.data;
    } catch (err) {
        console.log(' --> Error: ', err.message);
        return null;
    }
}
async function CreateBatchPG(batch) {
    try {
        var newBatch = new Batch()
        newBatch.BatchRef = batch.ref
        newBatch.BatchName = batch.name
        newBatch.Currency = batch.currencyId.code
        newBatch.PaymentAmount = batch.amount
        newBatch.Status = 'Ready'
        newBatch.DebitAccount = batch.debitAccountId.accountNumber
        newBatch.DebitBank = batch.debitAccountId.bankBranchId.swiftCode
        newBatch.NumberTrans = batch.totalTransaction
        newBatch.SubmitDate = new Date()
        newBatch.CreateDate = new Date()
        newBatch.LocalCharge = batch.localCharge
        newBatch.GatewayMethod = batch.gatewayMethod
        await newBatch.save();
        return newBatch;
    } catch (error) {
        throw error;
    }

}
module.exports = BatchService;