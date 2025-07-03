const Queue = require('bull');
const XMLFileGenerationQueue = new Queue('XMLFileGenerationQueue');
const XMLFileGeneration = {
    JobProcess: async function (job, done) {
        try {

            done();

        } catch (error) {
            job.log(`Run XMLFileGeneration :: ${error}`);
            done(new Error(error));
        }
    },

    JobRegister: function () {
        XMLFileGenerationQueue.process('*', async function (job, done) {
            await XMLFileGeneration.JobProcess(job, done);
        });
     
        XMLFileGenerationQueue.on('completed', (job, result) => {
            logger.log('custom event scheduling completed', result);
        });

    }
}

module.exports = XMLFileGeneration;