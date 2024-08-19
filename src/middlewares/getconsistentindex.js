const { hashKey, getHostByKey } = require("../utils");
const { verifysign } = require("../utils/signatures");

const getconsistentindex = async(req, res, next) => {
    try {
        req.nodeKey = hashKey(req.query.key || Object.keys(req.body)[0]);
        req.nodeHost = getHostByKey(req.nodeKey);
        /* implementation of digital signatures secp256 to authorise read access only to the owners of a key
        if(req.body){
            const address = verifysign(JSON.stringify(Object.values(req.body)[0]), req.body.signature, req.body.from);
            if(address !== 0){
                const is_existing = await axios.get(req.nodeHost+"/api/get?key="+Object.keys(req.body)[0]);
                if(is_existing && is_existing.from.toLowerCase() === req.body.from.toLowerCase())
                    next();
                else if(is_existing)
                    return res.send({
                        msg: "Unathorised"
                    });
            }
        }
        */
        next();
    } catch(error){
        return res.send({
            status: 400,
            msg: JSON.stringify(error)
        });
    }
}


module.exports = {
    getconsistentindex
}