const crypto = require('crypto');

module.exports = {
  /**
   * Generate a unique BankRef for CEPA transfers
   * Format: BANKCODE + YYMMDD + random alphanumeric
   * Example: 001250527X3KD92A1
   * 
   * @param {string} bankCode - 3-digit bank code
   * @returns {string} - Generated bank reference
   */
  createBankRef(bankCode = 'SCB') {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomPart = crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 7);
    return `${bankCode}${datePart}${randomPart}`;
  },

  isUndefinedNullEmpty: function (value) {
    return typeof value === "undefined" || value === null || value === "";
  },
  base64ToArrayBuffer: function (base64) {
    return Buffer.from(base64, "base64")
  },

  responseError(res, error, code) {
    let errorMessage = error;
    if (typeof error === 'object' && typeof error.message !== 'undefined') {
      errorMessage = error.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: false, error: errorMessage });
  },
  responseSuccess(res, data, code) {
    let sendData = { success: true };

    if (typeof data === 'object') {
      sendData = Object.assign(data, sendData);
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(sendData);
  },
};