const { ethers } = require('ethers');

const privateKey = '<yourprivatekey';
const wallet = new ethers.Wallet(privateKey);


async function signData(data){
    const signature =  await wallet.signMessage(JSON.stringify(data));

    console.log('Signature:', signature);
    // return signature;
}

function verifysign(data, signature, from){
    const address = ethers.recoverAddress(ethers.hashMessage(JSON.stringify(data)), signature);
    console.log(address);
    if(address.toLowerCase() === from.toLowerCase())
        return address;
    return 0;
}

// signData({
//     "hello": "Sumit"
// });

// verifysign({
//     "hello": "Sumit"
// }, "0xcf2276c1f141920c54fbb506cfefccef364281c32696549e49bf52d5e163a54c6a16b94183790ce174e7cb3aadc97b8a78840ce10a5d5a5b8c79e007e50690721b")

module.exports = {
    verifysign
}
