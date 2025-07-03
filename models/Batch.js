var mongoose = require('mongoose');

var BatchSchema = new mongoose.Schema({    
    BatchRef: String,
    BatchName: String,
    Currency: String,
    PaymentAmount: Number,
    Rate: String,
    Status: String,
    DebitAccount: String,
    DebitBank: String,
    CreateDate: Date,
    SubmitDate: Date,
    NumberTrans: Number,
    BankAcceptdate: Date,
    BankRejectDate: Date,
    LocalCharge: String,
    RequestedExcutionDate: Date,
    GatewayMethod:String,
},
    {
        timestamps: true,
        collation: { locale: 'en_US', strength: 2 },
        collection: 'Batch'
    }
);

mongoose.model('Batch', BatchSchema);