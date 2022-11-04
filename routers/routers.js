const express = require("express");
const router = express.Router();
const Api = require("../lib/RestApi");

let { authparams } = require("../cred");
let sessionTime = "";

const api = new Api({
  susertoken:
    "a06465e762ece8afd21867a6b7704e92eeed410fbded18c506bed035b6966ac5",
  actid: "FA54017",
});

const wss_feed = (wss) => {
  wss.on("connection", (ws) => {
    let instrument = "";
    function receiveQuote(data) {
      console.log(data);
      ws.send(JSON.stringify(data));
    }

    function open(data) {
      let instruments = instrument;
      api.subscribe(instruments);
      console.log("subsribing to :: ", instruments);
    }
    params = {
      socket_open: open,
      quote: receiveQuote,
    };
    ws.on("message", (message) => {
      instrument = message;
      api.start_websocket(params);
      console.log("received: %s", message);
    });
  });
};

router.get("/login", (req, res) => {
  api
    .login(authparams)
    .then((responce) => {
      sessionTime = responce.susertoken;
      console.log("s", sessionTime);
      res.send({ responce });
    })
    .catch((err) => {
      console.error(err);
    });
});

router.get("/bn", (req, res) => {
  console.log(req.query.ticker);
  const exch = "NFO";
  const query = req.query.ticker;
  try {
    api
      .searchscrip((exchange = exch), (searchtext = query))
      .then((reply) => {
        res.send({ reply });
      })
      .catch((error) => {
        console.log("error", error);
        res.send({ e: "Session Expired" });
      });
  } catch (e) {
    res.send({ e });
  }
});

router.get("/n", (req, res) => {
  try {
    api
      .get_quotes("NSE", "26000")
      .then((responce) => {
        console.log(responces);
        res.send({ lp: responce.lp });
      })
      .catch((error) => {
        console.log("error", error);
        res.send({ e: "Session Expired :  Invalid Session Key" });
      });
  } catch (e) {
    res.send({ e });
  }
});

router.get("/ws", (req, res) => {
  res.send({ He: "Hello" });
});

// router.get("/logout", (req, res) => {
//   const exch = "NFO";
//   const query = "BANKNIFTY";
//   api.logout().then((reply) => {
//     res.send({ reply });
//   });
// });

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/place-sl-order", (req, res) => {
  console.log(req.body);

  // place order
  let orderparams = {
    buy_or_sell: "B",
    product_type: "C",
    exchange: "NSE",
    tradingsymbol: req.body.strike, //"BANKNIFTY08SEP22P28000",
    quantity: 1,
    discloseqty: 0,
    price_type: "SL-LMT",
    retention: "DAY",
    trigger_price: req.body.triggerPrice,
    price: req.body.price,
    remarks: "my_order_002",
  };

  api
    .place_order(orderparams)
    .then((reply) => {
      console.log("Order responce", reply);
    })
    .catch((e) => {
      console.log(e.data);
    });

  res.send({ order: "New order Placed" });
});

module.exports = { router, wss_feed };
