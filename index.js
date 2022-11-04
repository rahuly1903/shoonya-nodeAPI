const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const WS = require("ws");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");

const wss = new WS.Server({ server });
const shoonyaRouter = require("./routers/routers");
const port = process.env.port || 4100;

shoonyaRouter.wss_feed(wss);
app.use(cors());
app.use("/finvasia", express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/", shoonyaRouter.router);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
