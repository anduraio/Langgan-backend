var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    product: {type: Schema.ObjectId, ref: 'Product', required: true},
    qty: {type: Number, required: true, max: 50},
    sub_total_price: {type: Number, required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for box item's URL
ItemSchema.virtual('url')
.get(function () {
  return '/boxitems/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
