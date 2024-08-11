const express = require("express");
const { router } = require("./routers");
const app = express();

app.use(express.json());

app.use("/api", router);

const port = 3000;

app.listen(port, () => {
    console.log(`server up and running at ${port}`);
})