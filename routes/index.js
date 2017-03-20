var express = require('express');
var router = express.Router();
var Forecast = require("./models/forecast-model")

router.get('/', function(req, res, next) {
  Forecast.find().then(result => {
    let data = {
      data: result,
      details: {}
    }
    if(result.length){
      data.details = result[0];
    }
    res.render('index', data);
  })
});


module.exports = router;
