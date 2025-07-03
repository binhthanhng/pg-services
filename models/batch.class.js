class batch {
    BatchRef = ""
    BatchName = ""
    Currency = ""
    PaymentAmount = 0
    Status = ""
    DebitAccount = ""
    DebitBank = ""
    CreateDate = new Date()
    SubmitDate = new Date()
    NumberTrans = 0
    BankAcceptdate = new Date()
    BankPaidDate = new Date()
    BankRejectDate = new Date()
    LocalCharge = ""
    RequestedExcutionDate = new Date()
    GatewayMethod = ""
    
    constructor(data) {
        this.BatchRef = data.BatchRef || null
        this.BatchName = data.BatchName || null
        this.Currency = data.Currency || null
        this.PaymentAmount = data.PaymentAmount || 0
        this.Status = data.Status || null
        this.DebitAccount = data.DebitAccount || null
        this.DebitBank = data.DebitBank || null
        this.CreateDate = data.CreateDate || null
        this.SubmitDate = data.SubmitDate || null
        this.NumberTrans = data.NumberTrans || 0
        this.BankAcceptdate = data.BankAcceptdate || null
        this.BankPaidDate = data.BankPaidDate || null
        this.BankRejectDate = data.BankRejectDate || null
        this.LocalCharge = data.LocalCharge || null
        this.RequestedExcutionDate = data.RequestedExcutionDate || null
        this.GatewayMethod = data.GatewayMethod || null
    }
}

module.exports = batch;