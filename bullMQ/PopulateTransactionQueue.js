var BatchService = require('../services/batch.services');
const Queue = require('bull');
const PopulateTransactionQueue = new Queue('PopulateTransactionQueue');
const PopulateTransaction = {
    JobProcess: async function (job, done) {
        try {
            //
            console.log('Test 1');
            //BatchService.CreateBatchByPVId('6836b7a8dbd4d49c5592ad87');
            done();

        } catch (error) {
            job.log(`Run PopulateTransaction: ${error}`);
            done(new Error(error));
        }
    },

    JobRegister: function () {
        PopulateTransactionQueue.process('*', async function (job, done) {
            await PopulateTransaction.JobProcess(job, done);
        });
     
        PopulateTransactionQueue.on('completed', (job, result) => {
            console.log('custom event scheduling completed');
        });

    }
}

module.exports = PopulateTransaction;