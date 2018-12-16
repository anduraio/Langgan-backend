var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UnitSchema = new Schema({
    property_id: {type: Schema.ObjectId, ref: 'Property', required: true},
    number: {type: Number, required: true, max: 50},
    tag_line: {type: String, required: true, max: 50},
    status: {type: String, required: true, enum:['Available', 'Maintenance', 'Rented', 'Reserved', 'Listed', 'Drafted'], default:'Drafted'},
    address: {type: String, required: true, max: 50},
    photo: {type: String, required: true, max: 50},
    price: {type: Number, required: true, max: 50},
    facility: {type: String, required: true, max: 50},
    capacity: {type: Number, required: true},
    size: {type: Number, required: true, max: 50},
    descriptions: {type: String, required: true, max: 200},
    policy: {type: String, required: true, max: 200},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for unit's URL
UnitSchema.virtual('url')
.get(function () {
  return '/unit/' + this._id;
});

module.exports = mongoose.model('Unit', UnitSchema);
