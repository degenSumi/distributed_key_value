const fs = require('fs');
const path = require('path');
const { hashKey, getHostByKey } = require("../utils");
const infra = require("../../infra/nodes.json");
const { default: axios } = require('axios');

async function gossip(url,msg,data=null){
    infra.nodes.map( async (node) => {
        await axios({
           "method": "post",
           "url": node + "/api/gossip",
           "data": {
               msg,
               url
           }
        });
   });
}
async function add_node(url) {
    const ringIndex = hashKey(url, infra.nodeSpace);
    if(infra.nodeKeys.includes(ringIndex))
        return "Place already taken";
    infra.nodeKeys.push(ringIndex);
    infra.nodes.push(url);
    await fs.writeFileSync(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
    const shif_source_node = getHostByKey(ringIndex + 1);
    migrate(shif_source_node,infra.nodes[infra.nodeKeys.indexOf(ringIndex)]);
};

async function remove_node(url) {
    const ringIndex = hashKey(url, infra.nodeSpace);
    if(!infra.nodeKeys.includes(ringIndex))
        return "unknown node";
    infra.nodeKeys.splice(infra.nodeKeys.indexOf(ringIndex),1);
    infra.nodes.splice(infra.nodes.indexOf(url),1);
    const host_destination = getHostByKey(ringIndex + 1);
    console.log(host_destination);
    fs.writeFileSync(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
    const shif_destination_node = getHostByKey(ringIndex + 1);
    // migrate(infra.nodes[infra.nodeKeys.indexOf(ringIndex)], shif_destination_node);
};

async function migrate(host_source, host_destination){
    console.log("migrating", host_source, host_destination);
    await axios({
        method: 'post',
        url: host_source + "/api/migrate",
        data: {
            node: host_destination
        }
    });
}

remove_node("http://localhost:3000")

module.exports = {
    add_node,
    remove_node
};