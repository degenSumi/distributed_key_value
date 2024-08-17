const { hashKey, getHostByKey } = require("../utils");

const getconsistentindex = async(req, res, next) => {
    req.nodeKey = hashKey(req.query.key || Object.keys(req.body)[0]);
    req.nodeHost = getHostByKey(req.nodeKey);
    next();
}


module.exports = {
    getconsistentindex
}