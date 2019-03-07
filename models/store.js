var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var StoreSchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true, max: 50},
    description: {type: String, required: false, max: 50},
    email: {type: String, required: false},
    phone: {type: String, required: false},
    address: {type: String, required: false},
    city: {type: String, required: false},
    state: {type: String, required: false},
    country: {type: String, required: false},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for store's URL
StoreSchema.virtual('url')
.get(function () {
  return '/store/' + this._id;
});

module.exports = mongoose.model('Store', StoreSchema);
