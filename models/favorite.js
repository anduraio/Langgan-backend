var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    product: {type: Schema.ObjectId, ref: 'Product', required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for store's URL
FavoriteSchema.virtual('url')
.get(function () {
  return '/favorite/' + this._id;
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
