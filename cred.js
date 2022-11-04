require("dotenv").config();

module.exports.authparams = {
  userid: process.env.USERID,
  password: process.env.PASSWORD,
  twoFA: process.env.TWO_FA,
  vendor_code: process.env.VENDOR_C,
  api_secret: process.env.API_SECRET,
  imei: process.env.IMEI,
};
