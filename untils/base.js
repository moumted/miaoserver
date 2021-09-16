var { createHmac } = require('crypto');
// var svgCaptcha = require('svg-captcha')


var setCreateHmac = (info) =>{
	return createHmac('sha256', "%%$%%123%%$%%")
					.update(info)
               		.digest('hex');
}

// var captcha = (info) =>{
// 	return svgCaptcha.create(info)
// 					.then(()=>{
// 						return true
// 					})
// 					.catch(()=>{
// 						return false
// 					})
// }

module.exports = {
	setCreateHmac,
	// captcha
}
