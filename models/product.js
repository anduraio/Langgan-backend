var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    store_id: {type: Schema.ObjectId, ref: 'Store', required: true},
    name: {type: String, required: true, max: 50},
    category_id: {type: Number, required: false},
    category_name: {type: String, required: false},
    brand: {type: String, required: false},
    barcode: {type: String, required: false},
    sku: {type: String, required: false},
    description: {type: String, required: true, max: 50},
    price: {type: Number, required: false},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for product's URL
ProductSchema.virtual('url')
.get(function () {
  return '/product/' + this._id;
});

module.exports = mongoose.model('Product', ProductSchema);
