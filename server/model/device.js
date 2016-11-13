var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
	deviceId : String,
  name: String,
	food : {
    name: {type: String},
    energy: { type: Number},
    protein: { type: Number},
    fat: { type: Number},
    alcohol: { type: Number},
    organicAcids: { type: Number},
    sugarAlcohol: { type: Number},
    saturatedFat: { type: Number},
    fiber: { type: Number},
    sugar: { type: Number},
    carbohydrate: { type: Number},
    salt: { type: Number},
  },
});

module.exports = mongoose.model('Device', deviceSchema);