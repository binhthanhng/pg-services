const { create } = require('xmlbuilder2');
const fs = require('fs');
const libxmljs = require('libxmljs2');
const path = require('path');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const { createBankRef } = require('./util.services');
var mongoose = require('mongoose');
require("../models/Batch");
require("../models/Transaction");
var Batch = mongoose.model('Batch');
var Transaction = mongoose.model('Transaction');

const creditTransfers = [
  {
    creditorName: 'John Doe',
    creditorIBAN: 'DE89370400440532013000',
    amount: 100.00,
    currency: 'EUR',
    remittanceInfo: 'Invoice 1234',
  },
  {
    creditorName: 'Jane Smith',
    creditorIBAN: 'FR1420041010050500013M02606',
    amount: 250.50,
    currency: 'EUR',
    remittanceInfo: 'Invoice 5678',
  }
];
class SepaService {
  
  static async createXmlSuccess(req, res) {
    let refff = createXml();
    res.status(200).send(refff);
  }
  static async createXmlValidate(batch, trans, isSuccess) {
    let refff = createXml(batch, trans, isSuccess);
    res.status(200).send(refff);
  }
  static async generateBankRef(bankCode = 'SCB') {
    let ref = createBankRef(bankCode);
    console.log('bank ref: ' + refff);
    return ref;
  }
  
}                       
module.exports = SepaService;

function createXml(batch, trans, isSuccess) { 
    try {
      let dummy = isSuccess ? 'DUMMYCODXXX' : trans.BIC
      const newGuid = uuidv4().toString().replaceAll('-', '');
      const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('Document', { xmlns: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03' })
      .ele('CstmrCdtTrfInitn')

        // Group Header
        .ele('GrpHdr')
        .ele('MsgId').txt(newGuid).up() //guid
        .ele('CreDtTm').txt(new Date().toISOString()).up()
        .ele('NbOfTxs').txt('1').up() // numberTranssaction
        .ele('CtrlSum').txt('100').up() //total amount
        .ele('InitgPty')
        .ele('Nm').txt('PRUDENTIAL').up()
        .up()
        .up()

        // Payment Information
        .ele('PmtInf')
        .ele('PmtInfId').txt(newGuid).up() //guid
        .ele('PmtMtd').txt('TRF').up()
        .ele('BtchBookg').txt('false').up()
        .ele('NbOfTxs').txt('1').up() //numberTransaction
        .ele('CtrlSum').txt('100').up() //totalamount
        .ele('PmtTpInf')
        .ele('SvcLvl')
        .ele('Cd').txt('URGP').up()
        .up()
        .up()
        .ele('ReqdExctnDt').txt('2025-05-28').up()

        // Debtor
        .ele('Dbtr')
        .ele('Nm').txt('PRUDENTIAL').up()
        .ele('PstlAdr')
        .ele('Ctry').txt('VN').up()
        .up()
        .up()
        .ele('DbtrAcct')
        .ele('Id')
        .ele('Othr')
        .ele('Id').txt('96310001').up() //acount bank mapping field Account
        .up()
        .up()
        .up()
        .ele('DbtrAgt')
        .ele('FinInstnId')
        .ele('BIC').txt('VTCBVNVX').up() //bankcode
        .up()
        .up()
        .ele('ChrgBr').txt('SLEV').up()

        // Iterate over each credit transfer
        .ele(creditTransfers.map((tx, index) => ({
          CdtTrfTxInf: {
            PmtId: {
              InstrId: `220344`, //id transaction,
              EndToEndId: `TRANS${index + 1}` //numberRef
            },
            Amt: {
              InstdAmt: {
                '@Ccy': tx.currency,
                '#': tx.amount
              }
            },
            CdtrAgt: {
              FinInstnId: {
                BIC: dummy, //bankcode
                Nm: `NGAN HANG MUFG BANK LTD CN TP HCM`
              }
            },
            Cdtr: {
              Nm: tx.creditorName,
              PstlAdr: {
                Ctry: `VM`
              }
            },
            CdtrAcct: {
              Id: {
                Othr: {
                  Id: `1234567890` // số tk
                }

              }
            },
            // RltdRmtInf: {
            //   RmtLctnMtd: `EMAL`,
            //   RmtLctnElctrncAdr: `vntest47@appvity.com`
            // },
            RmtInf: {
              Ustrd: tx.remittanceInfo
            }
          }
        })))
        .up()

        .up() // End PmtInf
        .up() // End CstmrCdtTrfInitn
      .up(); // End Document

      // Generate pretty XML string
      const xmlDoc1 = doc.end({ prettyPrint: true });
      //fs.writeFileSync('sepa_multi_credit.xml', xml);
      //validate file
      const filePathXsd = path.join(path.resolve(`./${config.filePath}`))
      const xsdString = fs.readFileSync(filePathXsd, 'utf8');

      const xsdDoc = libxmljs.parseXml(xsdString);
      const xmlDoc = libxmljs.parseXml(xmlDoc1);


      const isValid = xmlDoc.validate(xsdDoc);

      if (isValid) {
        console.log('XML is valid.');
      } else {
        console.log('XML is not valid:');
        console.log(xmlDoc.validationErrors);
      }

      fs.writeFileSync('sepa_multi_credit.xml', xmlDoc1);
    } catch (error) {
      console.log('log: ' + error);
    }

  }
