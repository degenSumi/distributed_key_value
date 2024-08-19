const express = require("express");
const { router } = require("./routers");
const { add_node, remove_node } = require("./services");

const app = express();

app.use(express.json());

app.use("/api", router);

const port = 3000;

add_node(`<fill_me>`);  // Add your public IP

app.listen(port, () => {
    console.log(`server up and running at ${port}`);
})

const cleanup = async () => {
   console.log("closing the server");
   await remove_node(`http://localhost:${port}`);
   process.exit(0);
}

process.on("SIGINT", cleanup);
// process.on("SIGTERM", cleanup);
process.on("exit", cleanup);