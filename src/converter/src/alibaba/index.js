const wxmlConvert = require('./wxml');
const wxssConvert = require('./wxss');
const jsonConvert = require('./json');
const scriptConvert = require('./script');

module.exports = {
  wxml: wxmlConvert,
  wxss: wxssConvert,
  json: jsonConvert,
  script: scriptConvert
};