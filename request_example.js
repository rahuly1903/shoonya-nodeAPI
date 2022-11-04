// const Api = require("./lib/RestApi");

// let { authparams } = require("./cred");

// api = new Api({});

// api
//   .login(authparams)
//   .then((res) => {
//     console.log("Reply: ", res.actid);

//     // if (res.stat !== "Ok") return;

//     // //get quote example
//     // api
//     //   .get_time_price_series("NSE", "22", "1645039801", "1645119424", "1")
//     //   .then((reply) => {
//     //     console.log(reply);
//     //   });

//     // //search scrip example
//     // api.searchscrip('NFO', 'NIFTY DEC CE').then((reply) => { console.log(reply); });

//     // //get quote example
//     // api.get_quotes('NSE', '22').then((reply) => { console.log(reply); });

//     // api.get_orderbook().then((reply) => { console.log(reply); });

//     // api.get_tradebook().then((reply) => { console.log(reply); });

//     api.get_holdings().then((reply) => {
//       console.log(reply);
//     });

//     // api.get_positions().then((reply) => { console.log(reply); });
//   })
//   .catch((err) => {
//     console.error(err);
//   });

var fs = require("fs");

// async function readFile() {
// await fs.readFile("./app_helper/orders.json", function (err, buf) {
//   console.log(buf.toString());
// });
// }
const t1 = performance.now();
const readFilePromise = new Promise(function (resolve, reject) {
  fs.readFile("./app_helper/orders.json", function (err, buf) {
    if (err) {
      return reject("No data available");
    }
    // promise resolved on success
    resolve(buf.toString());
  });
});

readFilePromise
  .then((response) => {
    console.log("Resolve", JSON.parse(response));
    console.log("Rahul");
    const t3 = performance.now();
    console.log(t3 - t1);
  })
  .catch((error) => {
    console.log("Reject", error);
  });

let p = new Promise(function (resolve, reject) {
  resolve(10);
});
const t2 = performance.now();
console.log(t2 - t1);
