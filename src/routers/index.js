const { Router } = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { hashKey, getHostByKey } = require("../utils");
const router = Router();

const storage_dir = path.resolve(__dirname, "../../infra/storage/");

router.get("/get",  async (req,res) => {
    const nodeKey = hashKey(req.query.key);
    const nodeHost = getHostByKey(nodeKey);
    try {
        console.log(req.get('host'));
        if(nodeHost === req.protocol + "://" + req.get('host')){
            const item = fs.readFileSync(path.join(storage_dir,req.query.key)+'.json');
            return res.send({
                status: "200",
                data: Buffer.from(item).toString() 
            });
        }
        const item = await axios.get(nodeHost+"/api/get?key="+req.query.key)
        return res.send({
            status: item.status,
            data: item.data
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
});

router.post("/put",  async (req,res) => {
    const nodeKey = hashKey(Object.keys(req.body)[0]);
    const nodeHost = getHostByKey(nodeKey);
    try{
        if(nodeHost == req.protocol + "://" + req.get('host')){
            fs.writeFileSync(path.join(storage_dir,Object.keys(req.body)[0])+'.json', JSON.stringify(req.body));
            return res.send({
                status: 200,
                data: req.body
            })
        }
        console.log(nodeHost + "/api/put");
        const item = await axios({
            method: 'post',
            url: nodeHost + "/api/put",
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
});

router.post("/migrate", async (req,res) => {
    fs.readdir(path.resolve(__dirname,"../../infra/storage")).forEach(async (file) => {
        const key = file.split('.');
        if(hashKey(key)<=req.query.dstkey){
            const data = fs.readFile(path.resolve(__dirname,"../../infra/").join(file));
            axios({
                method: 'post',
                url: req.body.node + "/api/put",
                data: data
            });
            // Delete the key on the source node
        }
    });
    return res.send({
        status: "200",
        msg: `Migration Completed to ${req.body.node}`
    })
});

router.post("/gossip", async (req,res) => {
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
            fs.writeFileSync(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
            break;
        case "add": 
            if(infra.nodeKeys.includes(ringIndex))
                return res.send({
                    status: "200",
                    msg: "Place already taken"
                });
            infra.nodeKeys.push(ringIndex);
            infra.nodes.push(req.body.url);
            fs.writeFileSync(path.resolve(__dirname, "../../infra/nodes.json"),JSON.stringify(infra));
            break;
        default:
            return res.send({
                status: "200",
                msg: `Running`
            });
    };
    
    return res.send({
        status: "200",
        msg: `Migration Completed to ${req.body.node}`
    })
});

module.exports = {
    router
}