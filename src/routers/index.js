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
        if(nodeHost === req.protocol + "://" + req.get('host')){
            const item = fs.readFileSync(path.join(storage_dir,req.query.key));
            return res.send({
                status: "200",
                data: Buffer.from(item).toString() 
            });
        }
        const item = await axios.get(nodeHost+"/api/get?key="+req.query.key)
        return res.send({
            status: "200",
            data: item
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
            fs.writeFileSync(path.join(storage_dir,Object.keys(req.body)[0]), JSON.stringify(req.body));
            return res.send({
                status: 200,
                data: req.body
            })
        }
        const item = await axios({
            url: nodeHost,
            data: req.body
        });
        return res.send(item);
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

module.exports = {
    router
}