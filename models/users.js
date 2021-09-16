var mongoose = require('mongoose');
var { Head }  =require('../untils/config.js')
var url = require('url')

var UserSchema = new mongoose.Schema({
    username : { type : String , required : true , index : {unique : true}},
    password : { type : String ,required :true},
    email :{ type : String , required : true , index : {unique : true}},
    date : {type : Date ,default : Date.now() },
    isAdmin : {type : Boolean , default : false},
    isFreeze : {type : Boolean , default : false},
    userHead : { type : String ,default : url.resolve(Head.baseUrl,'default.jpg')}
});

var UserModel = mongoose.model('user', UserSchema);
// UserModel.createIndexes();

var save = (data) =>{
    var user = new UserModel(data);
    return user.save()
            .then(()=>{
                return true
            })
            .catch(()=>{
                return false
            })
}

var findEmail = (data)=>{
    return UserModel.find(data)
            .then(()=>{
                return true
            })
            .catch(()=>{
                return false
            })
}


var findLogin = (data)=>{
    return UserModel.findOne(data);
}

var updatePassword = (email ,password)=>{
    return UserModel.updateOne({email}, {$set : {password}})
                    .then(()=>{
                        return true
                    })
                    .catch(()=>{
                        return false
                    })
}

var  usersList = ()=>{
    return UserModel.find();
}

var updateFreeze = (email , isFreeze) =>{
    return UserModel.updateOne({email},{$set : {isFreeze}})
                     .then(()=>{
                        return true
                    })
                    .catch(()=>{
                        return false
                    })   
}

var deleteList = (username , email)=>{
    return UserModel.deleteOne({username , email })
                    .then(()=>{
                        return true
                    })
                    .catch(()=>{
                        return false
                    })
}

var updateUserHead = ( username , userHead ) =>{
    return UserModel.updateOne({ username } , {$set : {userHead}})
                    .then(()=>{
                        return true
                    })
                    .catch(()=>{
                        return false
                    })
}


module.exports = {
    
    save,
    findLogin,
    updatePassword,
    usersList,
    updateFreeze,
    deleteList,
    updateUserHead,
    findEmail
}