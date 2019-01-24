var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var BoxSchema = new Schema({
    store_id: {type: Schema.ObjectId, ref: 'Store', required: true},
    name: {type: String, required: true, max: 50},
    description: {type: String, required: true, max: 50},
    price: {type: Number, required: true, max: 50},
    products: [{ type: Schema.ObjectId, ref: 'Product' }],
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for box's URL
BoxSchema.virtual('url')
.get(function () {
  return '/box/' + this._id;
});

module.exports = mongoose.model('Box', BoxSchema);
