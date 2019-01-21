var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {type: String, required: false},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for store's URL
CategorySchema.virtual('url')
.get(function () {
  return '/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
