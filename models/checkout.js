var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var CheckoutSchema = new Schema({
    store: {type: Schema.ObjectId, ref: 'Store', required: true},
    items: [{ type: Schema.ObjectId, ref: 'Item' }],
    sub_total: {type: Number, required: true},
    delivery_address: {type: String, required: true},
    delivery_address_lat: {type: String, required: true},
    delivery_address_long: {type: String, required: true},
    delivery_cost: {type: Number, required: true},
    total_payment: {type: Number, required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for box item's URL
ItemSchema.virtual('url')
.get(function () {
  return '/boxitems/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
