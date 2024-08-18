const { hashKey, getHostByKey } = require("../utils");

const getconsistentindex = async(req, res, next) => {
    try {
        req.nodeKey = hashKey(req.query.key || Object.keys(req.body)[0]);
        req.nodeHost = getHostByKey(req.nodeKey);
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