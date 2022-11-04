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
  let instruments = "NSE|26000#NSE|10576";
  api.subscribe(instruments);
  console.log("subsribing to :: ", instruments);
}
let orderTime = [1430, 1435, 1440, 1445];
let OrderData = {
  1430: [
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
  ],
  1435: [
    {
      product_type: "C",
      order_id: "",
      order_strike: "",
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
      order_price: "",
      sl_order_id: "",
      sl_order_price: "",
      is_stopLoss_hit: false,
      number_of_trade: 0,
    },
  ],
  1440: [
    {
      product_type: "C",
      order_id: "",
      order_strike: "",
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
      order_price: "",
      sl_order_id: "",
      sl_order_price: "",
      is_stopLoss_hit: false,
      number_of_trade: 0,
    },
  ],
  1445: [
    {
      product_type: "C",
      order_id: "",
      order_strike: "",
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
      order_price: "",
      sl_order_id: "",
      sl_order_price: "",
      is_stopLoss_hit: false,
      number_of_trade: 0,
    },
  ],
};

//Price round off
nifty_price_roundOf = (params) => {
  let mod = parseInt(params) % 50;
  let atm_Strike, atm_trading_symbol;
  if (mod < 25) {
    atm_Strike = parseInt(Math.floor(params / 50)) * 50;
  } else {
    atm_Strike = parseInt(Math.ceil(params / 50)) * 50;
  }
  return atm_Strike;
};

//takes dayIndex from sunday(0) to saturday(6)
upcoming_weekly_expiry = (dayIndex, params) => {
  var today = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 7) + 1
  );
  const expiray_month = today
    .toLocaleString("default", {
      month: "short",
    })
    .toUpperCase();
  const expiray_day = today.getDate();
  const expiray_year = String(today.getFullYear()).slice(2);
  const roundOffNifty = nifty_price_roundOf(params);
  const arr_data = `NIFTY${expiray_day}${expiray_month}${expiray_year}`;
  return [arr_data, roundOffNifty];
};

strike_price_selection = (params) => {
  const expiray_date = upcoming_weekly_expiry(4, params);
  return expiray_date;
};

api
  .login(authparams)
  .then((res) => {
    console.log(
      `Connection done at ${res.request_time} for client (${res.actid}/${res.uname})`
    );

    check_time_based_reenter_every_minute = (hour, minutes, seconds) => {
      // console.log(`Minute - ${hour}:${minutes}:${seconds}`);
      Object.entries(OrderData).forEach(([Key, Value]) => {
        OrderData[Key].forEach((data, index) => {
          if (
            OrderData[Key][index]["is_stopLoss_hit"] &&
            OrderData[Key][index]["number_of_trade"] < 3 &&
            OrderData[Key][index]["number_of_trade"] > 0
          ) {
            OrderData[Key][index]["number_of_trade"] += 1;
            // console.log(OrderData);
          }
        });
      });
    };

    let strike, trading_symbol;
    check_time_based_enter_every_second = (hour, minutes, seconds) => {
      // console.log(`Every second - ${hour}:${minutes}:${seconds}`);
      const current_time = hour + "" + minutes;
      // console.log(current_time);

      Object.entries(OrderData).forEach(([Key, Value]) => {
        OrderData[Key].forEach((data, index) => {
          if (
            OrderData[Key][index]["number_of_trade"] == 0 &&
            current_time > parseInt(Key)
          ) {
            api.get_quotes("NSE", "26000").then((res) => {
              strike = strike_price_selection(res.lp);
              trading_symbol =
                strike[0] + OrderData[Key][index]["product_type"] + strike[1];
              OrderData[Key][index]["number_of_trade"] += 1;
              OrderData[Key][index]["order_strike"] = strike[1];
              OrderData[Key][index]["order_tysm"] = trading_symbol;

              api.get_quotes("NFO", trading_symbol).then((res) => {
                const stopLossPrice = parseFloat(res.lp * 1.03);
                OrderData[Key][index]["order_price"] = res.lp;
                OrderData[Key][index]["sl_order_price"] = stopLossPrice;
                console.log(OrderData);
              });
            });
          }
        });
      });
    };

    setInterval(function () {
      const d = new Date();
      const hour = d.getHours();
      const minutes = d.getMinutes();
      const seconds = d.getSeconds();
      check_time_based_enter_every_second(hour, minutes, seconds);
      if (seconds == 0) {
        check_time_based_reenter_every_minute(hour, minutes, seconds);
      }
    }, 1000);

    // api
    //   .searchscrip((exchange = "NFO"), (searchtext = "NIFTY 16000"))
    //   .then((res) => {
    //     console.log("Reply: ", res);
    //   });

    api
      .get_option_chain("NFO", "NIFTY28JUL22C16000", "15700", "4")
      .then((res) => {
        console.log("Reply: ", res);
      });

    // api.get_quotes("NFO", "NIFTY30JUN22P15750").then((res) => {
    //   console.log(res.lp);
    // });
    // api.get_quotes("NSE", "26000").then((res) => {
    //   strike_price_selection(res.lp);
    // });

    // api.get_positions().then((res) => {
    //   console.log("get_positions: ", res);
    // });

    // 22062700256855
    // api.get_single_order_history("22062700268103").then((res) => {
    //   console.log("get_single_order_history: ", res);
    // });

    // let params = {
    //   socket_open: open,
    //   quote: receiveQuote,
    //   order: receiveOrders,
    // };

    // api.start_websocket(params);

    // place order
    // let orderparams = {
    //   buy_or_sell: "B",
    //   product_type: "C",
    //   exchange: "NSE",
    //   tradingsymbol: "ITC-EQ",
    //   quantity: 1,
    //   discloseqty: 0,
    //   price_type: "MKT",
    //   retention: "DAY",
    //   price: 0,
    //   remarks: "my_order_002",
    // };

    // api
    //   .place_order(orderparams)
    //   .then((reply) => {
    //     console.log("Order responce", reply);
    //     let stopLossOrderParams = {
    //       buy_or_sell: "S",
    //       product_type: "C",
    //       exchange: "NSE",
    //       tradingsymbol: "ITC-EQ",
    //       quantity: 1,
    //       discloseqty: 0,
    //       price_type: "SL-LMT",
    //       price: 260,
    //       trigger_price: 261,
    //       retention: "DAY",
    //       remarks: "my_order_002",
    //     };

    //     api.place_order(stopLossOrderParams).then((reply) => {
    //       console.log("StopLoss responce", reply);
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    return;
  })
  .catch((err) => {
    console.error("err", err);
  });
