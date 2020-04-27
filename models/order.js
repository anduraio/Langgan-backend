var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    order_id: {type: String, required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for product's URL
OrderSchema.virtual('url')
.get(function () {
  return '/order/' + this._id;
});

module.exports = mongoose.model('Order', OrderSchema);
