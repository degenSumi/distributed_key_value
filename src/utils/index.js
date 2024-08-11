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
    for (let i = 0; i < nodeKeys.length; i++) {
        if (nodeKeys[i] = nodeKey){
            return nodes[i] 
        }
        else if (nodeKeys[i] > nodeKey){
            return nodes[i - 1] 
        }
        else return nodes[0];
    }
}

// console.log(hashKeySimple("SumitPowerLoom1", 20));
// console.log(hashKey("SumitPowerLoom1", 20));

module.exports = {
    hashKey,
    hashKeySimple,
    getHostByKey
}