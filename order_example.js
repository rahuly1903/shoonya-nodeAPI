const Api = require("./lib/RestApi");

let { authparams } = require("./cred");

api = new Api({});

function receiveQuote(data) {
  console.log("Quote ::", data);
}

function receiveOrders(data) {
  console.log("Order ::", data);
}

function open(data) {
  let instruments = "NSE|22#BSE|500400";
  api.subscribe(instruments);
  console.log("subsribing to :: ", instruments);
}
try {
  api.login(authparams).then((res) => {
    console.log("Reply: ", res);
  });
} catch (e) {
  console.log("e", e);
}

// const exch = "NFO";
// const query = "BANKNIFTY";
// api.searchscrip((exchange = exch), (searchtext = query)).then((reply) => {
//   console.log(reply);
// });

// api
//   .login(authparams)
//   .then((res) => {
//     console.log("Reply: ", res.uname);

//     const exch = "NFO";
//     const query = "BANKNIFTY";
//     api.searchscrip((exchange = exch), (searchtext = query)).then((reply) => {
//       console.log(reply);
//     });

//     // place order
//     // let orderparams = {
//     //   buy_or_sell: "B",
//     //   product_type: "C",
//     //   exchange: "NFO",
//     //   tradingsymbol: "BANKNIFTY08SEP22P28000",
//     //   quantity: 1,
//     //   discloseqty: 0,
//     //   price_type: "MKT",
//     //   retention: "DAY",
//     //   price: 0,
//     //   remarks: "my_order_002",
//     // };

//     // api
//     //   .place_order(orderparams)
//     //   .then((reply) => {
//     //     console.log("Order responce", reply);
//     //     // // Place stoploss to order
//     //     let stopLossOrderParams = {
//     //       buy_or_sell: "S",
//     //       product_type: "C",
//     //       exchange: "NSE",
//     //       tradingsymbol: "ITC-EQ",
//     //       quantity: 1,
//     //       discloseqty: 0,
//     //       price_type: "SL-LMT",
//     //       price: 260,
//     //       trigger_price: 261,
//     //       retention: "DAY",
//     //       remarks: "my_order_002",
//     //     };

//     //     api.place_order(stopLossOrderParams).then((reply) => {
//     //       console.log("StopLoss responce", reply);
//     //     });
//     //   })
//     //   .catch((err) => {
//     //     console.log(err);
//     //   });
//   })
//   .catch((err) => {
//     console.error(err);
//   });
