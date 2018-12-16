var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var PropertySchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true, max: 50},
    address: {type: String, required: true, max: 50},
    state: {type: String, required: true, max: 50},
    city: {type: String, required: true, max: 50},
    postal_code: {type: Number, required: false},
    type: {type: String, required: true, enum:['House', 'Apartment', 'Condominium', 'Office', 'Space', 'Room', 'Building', 'Land', 'Farm', 'Storage'], default:'House'},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for property's URL
PropertySchema.virtual('url')
.get(function () {
  return '/property/' + this._id;
});

module.exports = mongoose.model('Property', PropertySchema);
