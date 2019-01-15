var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true, max: 50},
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
