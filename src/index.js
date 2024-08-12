const express = require("express");
const { router } = require("./routers");
const { add_node } = require("./services");

const app = express();

app.use(express.json());

app.use("/api", router);

const port = 3000;

add_node(`http://localhost:${port}`);

app.listen(port, () => {
    console.log(`server up and running at ${port}`);
})