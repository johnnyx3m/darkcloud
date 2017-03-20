const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const location = new Schema({
  city: { type: String },
  state: { type: String },
  state_name: { type: String },
  country: { type: String },
  longitude: { type: String },
  latitude: { type: String },
  elevation: { type: String }
})

const forecastSchema = new Schema({
  display_location: location,
  observation_time: { type: String },
  temp_f: { type: String },
  temp_c: { type: String },
  feelslike_f: { type: String },
  feelslike_c: { type: String },
  dewpoint_f: { type: String },
  dewpoint_c: { type: String },
  heat_index_f: { type: String },
  heat_index_c: { type: String },
  relative_humidity: { type: String },
  wind_string: { type: String },
  wind_dir: { type: String },
  wind_degrees: { type: String },
  wind_mph: { type: String },
  wind_gust_mph: { type: String },
  wind_kph: { type: String },
  wind_gust_kph: { type: String },
  weather: { type: String },
  longitude: { type: Number },
  latitude: { type: Number },
  icon: { type: String },
  icon_url: { type: String },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('forecast', forecastSchema);;
