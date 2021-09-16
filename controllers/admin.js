var UserModel = require('../models/users.js')

var usersList = async (req,res,next)=>{
	var result = await UserModel.usersList();
	if(result){
		res.send({
			msg : '所有用户信息',
			status : 0,
			data : {
				userlist : result
			}
		})
	}
	else{
		res.send({
			msg : '获取用户信息失败',
			status : -1
		})
	}
}

var updateFreeze = async(req,res,next) =>{
	var {email ,isFreeze} = req.body;
	var result = await UserModel.updateFreeze(email ,isFreeze);

	if(result){
		res.send({
			msg : '账号冻结成功',
			status : 0
		});
	}else{
		res.send({
			msg : '账号冻结失败',
			status : -1
		})
	}
}

var deleteList = async(req,res,next)=>{
	var {username , email} = req.body;
	var result = await UserModel.deleteList(username , email);

	if(result){
		res.send({
			msg : '删除成功',
			status : 0
		})
	}
	else{
		res.send({
			msg : '删除失败',
			status : -1
		})
	}
}





module.exports = {
	usersList,
	updateFreeze,
	deleteList
}