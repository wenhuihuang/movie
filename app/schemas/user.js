var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:String,
    // 0 normal user  也可以设置 大于10的是admin  用一种机制管理用户类型
    role:{
        type:Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

UserSchema.pre('save',function (next) {
    var user = this;
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    /*bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
     if (err) {
     return next(err)
     }
     bcrypt.crypto.Hash(user.password, salt, function (err, hash) {
     if (err) {
     return next(err)
     }
     user.password = hash
     next()
     })
     })*/
    bcrypt.hash(user.password, null, null, function (err, hash){
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})
UserSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb);
    }
}
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        var hash = this.password;
        var isMatch = bcrypt.compareSync(_password, hash);
        cb(null, isMatch);
    }
};
module.exports = UserSchema;