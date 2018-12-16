var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LanlordSchema = new Schema({
    user_id: {type: Schema.ObjectId, ref: 'User', required: true},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for landlord's URL
LanlordSchema.virtual('url')
.get(function () {
  return '/lanlord/' + this._id;
});

module.exports = mongoose.model('Lanlord', LanlordSchema);
