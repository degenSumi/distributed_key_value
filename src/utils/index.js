const crypto = require("crypto");
const { nodeSpace, nodeKeys, nodes }  = require("../../infra/nodes.json");

function hashKeySimple(key, hashSpace = nodeSpace){
    const slot  = Buffer.byteLength(key, 'utf-8') % hashSpace;
    return slot;
}

function hashKey(key, hashSpace = nodeSpace){
    const hash = crypto.createHash('sha256');
    hash.update(Buffer.from(key,'utf-8'));
    const digest = hash.digest('hex');
    const keyNumber = Number(`0x` + digest.slice(0,16));
    return Number(keyNumber % hashSpace);
}

function getHostByKey(nodeKey){
    let nodeindex = 0;
    let spacing = nodeSpace * 2;
    for (let i = 0; i < nodeKeys.length; i+=1) {
        if (nodeKeys[i] == nodeKey) {
            return nodes[i];
        }
        if ( nodeKeys[i] > nodeKey && nodeKeys[i] - nodeKey  < spacing){
         spacing = nodeKeys[i] - nodeKey;
         nodeindex = i;
        }
    }
    return nodes[nodeindex];
}


// console.log(hashKeySimple("SumitPowerLoom1", 20));
// console.log(hashKey("http://localhost:3002", 50));

module.exports = {
    hashKey,
    hashKeySimple,
    getHostByKey
}