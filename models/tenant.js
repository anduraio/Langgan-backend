var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TenantSchema = new Schema({
    name: {type: Integer, required: true, max: 50},
    email: {type: String, required: true, index: { unique: true }, max: 255},
    phone: {type: Integer, required: true, max: 50},
    occupation: {type: String, required: true, max: 255},
    country: {type: String, required: true, max: 255},
    created_at: {type: Date},
    updated_at: {type: Date, default: Date.now}
});

// Virtual for tenant's URL
TenantSchema.virtual('url')
.get(function () {
  return '/tenant/' + this._id;
});

module.exports = mongoose.model('Tenant', TenantSchema);
