var Api = {
    loginParam: function (code, rawData, signature, encryptedData, iv) {
        return {
            code: code,
            rawData: rawData,
            signature: signature,
            encryptedData: encryptedData,
            iv: iv
        }
    }
}


module.exports = {
    Api: Api
}