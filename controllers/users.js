var {Email , Head} = require('../untils/config.js');
var UserModel = require('../models/users.js');
var { reset } = require('nodemon');
var { setCreateHmac , captcha } = require('../untils/base.js');
var svgCaptcha = require('svg-captcha');
var fs = require('fs');
var url = require('url');

var login = async (req,res,next)=>{
    var { username , password ,imgCode} = req.body;
    
    if(imgCode.toLowerCase() != req.session.imgCode){
        res.send({
            msg : '验证码不正确',
            status : -3,
            log : req.session.imgCode
        })
        return;
    }


    var result = await UserModel.findLogin({
        username,
        password : setCreateHmac(password)
    });

    if(result){
        req.session.username = username;
        req.session.isAdmin = result.isAdmin;
        req.session.userHead = result.userHead;

        if(result.isFreeze){
            res.send({
                msg : "账号已冻结",
                status : -2
            })
        }else{
            res.send({
                msg : '登陆成功',
                status : 0
            });
        }
        return;
        
    }
    else{
        res.send({
            msg : '登陆失败',
            status : -1
        });
    }

};

var register = async (req,res,next)=>{
    var {username, password, email, verify} = req.body;


    if((Email.time - req.session.time) / 1000  > 60){
        res.send({
            msg : '验证码已过期',
            status : -3
        });
        return;
    }
    else{
        if( verify!== req.session.verify || email !== req.session.email){
            res.send({
                msg : '验证码错误',
                status : -2,
                verify : req.session.verify,
                time : Email.time ,
                session : req.session.time,
                nowtime : Date.now()
            })
            return;
        }

        else{
            var result = await UserModel.save({
                username,
                password : setCreateHmac(password) ,
                email

            });

            if(result){
                res.send({
                    msg : '注册成功',
                    status : 0
                })
                return;
            }
            else{ 
                let result = await UserModel.findEmail({email});              
                if(result){
                    res.send({
                        msg : '此邮箱已注册',
                        status : -4
                    })
                    return;
                }
                else{
                   res.send({
                    msg : '注册失败',
                    status : -1,
                    email : email
                    }) 
                }

                
            } 
        }
    }

};

var verify = async (req,res,next)=>{
    var email = req.query.email;
    var Verify = Email.verify;

    req.session.verify = Verify;
    req.session.email = email;
    req.session.time = Email.time

    var mailOptions = {
        from : '全民影院 461277664@qq.com',
        to : email,
        subject : '全民影院邮箱验证码',
        text : '验证码：' + Verify
    }

    Email.transporter.sendMail(mailOptions,(err)=>{
        if(err){
            res.send({
                msg : '验证码发送失败',
                status : -1,
            })
        }
        else{
            res.send({
                msg : '验证码发送成功',
                status : 0,
                Verify,
                验证码 : req.session.verify
            })
        }
    })


};

var logout = async (req,res,next)=>{
    req.session.username = "";
    res.send({
        msg : '退出成功',
        status : 0
    });
};

var getUser = async (req,res,next)=>{
    if(req.session.username){
        res.send({
            msg : '获取用户信息成功',
            status : 0,
            isAdmin : req.session.isAdmin,
            data : {
                username : req.session.username,
                
                userHead : req.session.userHead
            }
        })
    }
    else{
        res.send({
            msg : "获取用户信息失败",
            status : -1
        })
    }
};

var findPassword = async (req,res,next)=>{
    var { email , password ,verify} = req.body;

    if(email === req.session.email & verify === req.session.verify){
        var result = await UserModel.updatePassword(email,setCreateHmac(password))
        if(result){
            res.send({
                msg : '修改密码成功',
                status : 0
            });      
        }
        else{
            res.send({
                msg : '修改密码失败',
                status : -1
            });
        }
    }
    else{
        res.send({
            msg : '验证码错误',
            status : -1
        })
    }
};


var captcha = (req , res, next) =>{
    var captchaImg = svgCaptcha.create({
        noise : 3,
        backgrounnd : '#ff5033'
    });

    req.session.imgCode = captchaImg.text.toLowerCase();
    console.log(req.session.imgCode)

    res.type('svg');
    res.send(captchaImg.data)
}


var uploadUserHead = async (req,res,next) => {
    console.log(req.file.filename);
    await fs.rename( 'public/uploads/' + req.file.filename , 'public/uploads/' + req.session.username + '.jpg' , (err)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log('重命名成功')
    })

    var result = await UserModel.updateUserHead(req.session.username , url.resolve( Head.baseUrl , req.session.username + '.jpg'))
    if(result){
        res.send({
            status : 0,
            mag : '头像修改成功',
            data : {
                userHead : url.resolve( Head.baseUrl , req.session.username + '.jpg')
            }
        })
    }
    else{
        res.send({
            status : -1,
            msg : '头像修改失败'
        })
    }
}


module.exports = {
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword,
    captcha,
    uploadUserHead
};