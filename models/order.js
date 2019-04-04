var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    product_id: {type: Schema.ObjectId, ref: 'Product', required: true},
    qty: {type: Number, required: true, max: 50},
    sub_total_price: {type: Number, required: true, max: 50},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for product's URL
OrderSchema.virtual('url')
.get(function () {
  return '/order/' + this._id;
});

module.exports = mongoose.model('Order', OrderSchema);
