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
            fs.writeFileSync(path.join(storage_dir,Object.keys(req.body)[0])+'.json', JSON.stringify(req.body));
            return res.send({
                status: 200,
                data: req.body
            })
        }
        const item = await axios({
            method: 'post',
            url: nodeHost,
            data: req.body
        });
        return res.send({
            status: "200",
            data: item
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
            await axios({
                method: 'post',
                url: node,
                data: req.body
            });
        }
    })
});

module.exports = {
    router
}