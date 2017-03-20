var express = require('express');
var router = express.Router();
var Forecast = require('./models/forecast-model')
var Wunderground = require('node-weatherunderground');
var client = new Wunderground();
const notfound = { error: "Not found." }

//promisified function to send request to WU to get condition per city and state
const lookUpWeatherData = (city, state) =>{
  return new Promise((resolve, reject) =>{
    var opts = {
      key: process.env.WUNDERGROUND_KEY,
      city: city,
      state: state
    }
    client.conditions(opts, function(err, data) {
      if (err){
        reject(err)
      }
      else {
        resolve(data);
      }
    });
  })
}

//function to update or insert forecast in the database
const upsertWeatherData = (data) =>{
  return Forecast.findOneAndUpdate({
    "display_location.city": data.display_location.city,
    "display_location.state": data.display_location.state_name,
  }, data, {upsert: true, 'new': true})
  .catch(err => console.log("error on update"))
}

//a post route to be called upon clicking "Search location" in the UI
router.post('/', function(req, res, next) {
  let action = req.body.action;
  let city = req.body.city;
  let state = req.body.state;

  //it should have and action, city and state.
  if(action == "lookup" && city && state){
    //lookup, upsert, render
    lookUpWeatherData(city, state)
    .then(data => upsertWeatherData(data))
    .then(result => {
      res.render('../views/partials/details', { details: result })
    })
    .catch(err => {
      console.log("1")
      res.render('../views/partials/details', { details: notfound});
    })
  }
  else{
    res.status(500).json({error: "action, city and state are required."})
  }
});

router.get('/:id', function(req, res, next) {
  Forecast.findById(req.params.id)
  .then(result =>{
    if(!result) {
      result = notfound
    }
    res.render('../views/partials/details', { details: result });
  })
});

//route called upon clicking fetch-latest,
router.get('/', function(req, res, next){
  if(req.query.action == "fetch-latest"){
    Forecast.find().then(result =>{
      let data = result.length ?
      result.map(a => {
        lookUpWeatherData(a.display_location.city, a.display_location.state_name)
        .then(result => upsertWeatherData(result))
        .catch(err => console.log(err)) }) : [];
      res.render('../views/partials/list', { data: data })
    })
  }
  else{
    res.status(500).send({ error: "Action not found" })
  }
})

module.exports = router;
