class transaction {
    TranRef = ""
    PaymentRef = ""
    BankRef = ""
    BeneName = ""
    BeneAccount = ""
    BeneBankName = ""
    BeneBankCitadCode = ""
    BeneBankSwiftIbanCode = ""
    BeneBranchName = ""
    Currenry = ""
    PaymentAmount = 0
    Description = ""
    TranStatus = ""
    TranStatusMessage = ""
    PaymentType = ""
    Method = ""
    PayeeType = ""
    Budget = ""
    FundType = ""
    Source = ""
    BatchRef = ""
    PGRef = ""

    constructor(data) {
        this.TranRef = data.TranRef || ""
        this.PaymentRef = data.PaymentRef || ""
        this.BankRef = data.BankRef || ""
        this.BeneName = data.BeneName || ""
        this.BeneAccount = data.BeneAccount || ""
        this.BeneBankName = data.BeneBankName || ""
        this.BeneBankCitadCode = data.BeneBankCitadCode || ""
        this.BeneBankSwiftIbanCode = data.BeneBankSwiftIbanCode || ""
        this.BeneBranchName = data.BeneBranchName || ""
        this.PaymentAmount = data.PaymentAmount || 0
        this.Currenry = data.Currenry || ""
        this.Description = data.Description || ""
        this.TranStatus = data.TranStatus || ""
        this.TranStatusMessage = data.TranStatusMessage || ""
        this.PaymentType = data.PaymentType || ""
        this.Budget = data.Budget || ""
        this.FundType = data.FundType || ""
        this.Source = data.Source || ""
        this.BatchRef = data.BatchRef || ""
        this.PGRef = data.PGRef || ""
    }
}

module.exports = transaction;