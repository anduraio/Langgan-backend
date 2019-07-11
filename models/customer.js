var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for store's URL
CustomerSchema.virtual('url')
.get(function () {
  return '/customer/' + this._id;
});

module.exports = mongoose.model('Customer', CustomerSchema);
