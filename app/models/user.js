/**
 * Created by hui on 2016-10-22.
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User', UserSchema);

module.exports = User;
