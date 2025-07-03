var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({    
    TranRef: String,
    PGRef: String,
    BeneName: String,
    BeneAccount: String,
    BeneBankName: String,
    BeneBankCitadCode: String,
    BeneBankSwiftIbanCode: String,
    BeneBranchName: String,
    Currenry: String,
    PaymentAmount: Number,
    Description: String,
    TranStatus: String,
    BankStatus: String,
    TranStatusMessage: String,
    PaymentType: String,
    Method: String,
    PayeeType: String,
    Budget: String,
    FundType: String,
    Source: String,
    BatchId: String,
    PVTranId:String,
    PVBatchId: String,
    BankPaidDate: Date,
    BankRejectDate: Date,
},
    {
        timestamps: true,
        collation: { locale: 'en_US', strength: 2 },
        collection: 'Transaction'
    }
);

mongoose.model('Transaction', TransactionSchema);