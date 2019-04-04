var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
    store_id: {type: Schema.ObjectId, ref: 'Store', required: true},
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    plan: [{ type: Schema.ObjectId, ref: 'Box', required: true }],
    lat: {type: String, required: false},
    lon: {type: String, required: false},
    address: {type: String, required: false},
    city: {type: String, required: false},
    state: {type: String, required: false},
    country: {type: String, required: false},
    delivery: {type: String, required: false},
    status: {type: String, required: false},
    total_price: {type: Number, required: false},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for store's URL
SubscriptionSchema.virtual('url')
.get(function () {
  return '/subs/' + this._id;
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
