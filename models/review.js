var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    product_id: {type: Schema.ObjectId, ref: 'Product', required: true},
    review: {type: String, required: true},
    rate: {type: Number, required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for store's URL
ReviewSchema.virtual('url')
.get(function () {
  return '/review/' + this._id;
});

module.exports = mongoose.model('Review', ReviewSchema);
