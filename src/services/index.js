const fs = require('fs');
const path = require('path');
const { hashKey, getHostByKey } = require("../utils");
const infra = require("../../infra/nodes.json");

function add_node(url) {
    const ringIndex = hashKey(url, infra.nodeSpace);
    if(infra.nodeKeys.includes(ringIndex))
        return "Place already taken";
    infra.nodeKeys.push(ringIndex);
    infra.nodes.push(url);
    fs.writeFileSync(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
    const shiftnode = getHostByKey(ringIndex + 1);
    migrate(shiftnode,infra.nodes[infra.nodeKeys.indexOf(ringIndex)]);
};

function remove_node(url) {
    const ringIndex = hashKey(url, infra.nodeSpace);
    if(!infra.nodeKeys.includes(ringIndex))
        return "unknown node";
    infra.nodeKeys.pop(ringIndex);
    infra.nodes.push(url);
    fs.writeFileSync(infra);
};

async function migrate(host_source, host_destination){
    console.log("migrating", host_source, host_destination);
}

module.exports = {
    add_node
};