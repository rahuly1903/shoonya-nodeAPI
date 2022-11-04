setInterval(function () {
  const d = new Date();
  const hour = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  if (seconds == 0) {
    check_reenter_every_minute(hour, minutes, seconds);
  }
  check_time_based_enter_every_second(hour, minutes, seconds);
}, 1000);

module.exports = {
  OrderData,
  check_reenter_every_minute,
  check_time_based_enter_every_second,
  strike_price_selection,
};
