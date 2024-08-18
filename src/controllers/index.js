const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");
const { hashKey } = require("../utils");
const storage_dir = path.resolve(__dirname, "../../infra/storage/");
const infra = require("../../infra/nodes.json");

const get = async (req,res) => {
        try {
            console.log(req.get('host'));
            if(req.nodeHost === req.protocol + "://" + req.get('host')){
                const item = await fs.readFile(path.join(storage_dir,req.query.key)+'.json');
                return res.send({
                    status: "200",
                    data: Buffer.from(item).toString() 
                });
            }
            console.log("getting it from node: ", req.nodeHost);
            const item = await axios.get(req.nodeHost+"/api/get?key="+req.query.key)
            return res.send({
                status: item.data.status,
                data: item.data.data
            });
        } catch (error){
            switch(error.code){
                case "ENOENT": 
                default:
                 return res.send({
                    status: "400",
                    error: "Key Not In Storage"
                 });
            }
        }
};

const put = async (req,res) => {
    try{
        if(req.nodeHost === req.protocol + "://" + req.get('host')){
            fs.writeFile(path.join(storage_dir,Object.keys(req.body)[0])+'.json', JSON.stringify(req.body));
            return res.send({
                status: 200,
                data: req.body
            })
        }
        console.log("putting it to node: ", req.nodeHost);
        const item = await axios({
            method: 'post',
            url: req.nodeHost + "/api/put",
            data: req.body
        });
        return res.send({
            status: item.status,
            data: item.data.data
        });
    } catch(error){
        switch(error.code){
            case "ENOENT": 
            default:
             return res.send({
                status: "400",
                error: "Key Not In Storage"
             });
        }
    }
};

const migrate = async (req,res) => {
    const dir = path.resolve(__dirname,"../../infra/storage")
    const files = await fs.readdir(dir);
    for (const file of files){
        const key = file.split('.');
        if(hashKey(key[0])<=req.body.node){
            const data = await fs.readFile(path.resolve(__dirname,"../../infra/").join(file));
            axios({
                method: 'post',
                url: req.body.node + "/api/put",
                data: data
            });
            // Delete the key on the source node
        }
        console.log(key);
    };
    return res.send({
        status: "200",
        msg: `Migration Completed to ${req.body.node}`
    })
};

const gossip = async (req,res) => {
    const ringIndex = hashKey(req.body.url, infra.nodeSpace);
    switch(req.body.msg){
        case "remove" :
            if(!infra.nodeKeys.includes(ringIndex))
                return res.send({
                    status: "200",
                    msg: "Unknown NOde"
                });
            infra.nodeKeys.splice(infra.nodeKeys.indexOf(ringIndex),1);
            infra.nodes.splice(infra.nodes.indexOf(url),1);
            fs.writeFile(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
            break;
        case "add": 
            if(infra.nodeKeys.includes(ringIndex))
                return res.send({
                    status: "200",
                    msg: "Place already taken"
                });
            infra.nodeKeys.push(ringIndex);
            infra.nodes.push(req.body.url);
            fs.writeFile(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
            break;
        default:
            return res.send({
                status: "200",
                msg: `OK`
            });
    };
    
    return res.send({
        status: "200",
        msg: `Migration Completed to ${req.body.node}`
    })
};

// migrate({},{});

module.exports = {
    get,
    put,
    migrate,
    gossip
}