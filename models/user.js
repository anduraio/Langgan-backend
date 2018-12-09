var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: {type: String, required: true, max: 50},
    last_name: {type: String, required: true, max: 50},
    email: {type: String, required: true, index: { unique: true }, max: 255},
    password: { type: String, required: true },
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for user's full name
UserSchema.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.last_name;
});

// Virtual for user's URL
UserSchema.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
