const Api = require("./lib/RestApi");

const api = new Api({});

// while (true) {
//   api.customSetSession();
// }

const arr = [1430, 1435, 1440, 1445];

const callPutOption = [
  {
    product_type: "C",
    order_id: "",
    order_strike: "",
    order_tysm: "",
    order_price: "",
    sl_order_id: "",
    sl_order_price: "",
    is_stopLoss_hit: false,
    number_of_trade: 0,
  },
  {
    product_type: "P",
    order_id: "",
    order_strike: "",
    order_tysm: "",
    order_price: "",
    sl_order_id: "",
    sl_order_price: "",
    is_stopLoss_hit: false,
    number_of_trade: 0,
  },
];

const obj = {};

for (var i = 0; i < 4; i++) {
  obj[arr[i]] = callPutOption;
}

console.log(obj);
