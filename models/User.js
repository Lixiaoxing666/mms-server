// 导入mongoose第三方模块
const mongoose = require('mongoose')
// 对象规则验证
const Joi = require('joi')
// hash密码
const bcrypt = require('bcryptjs')

// 创建用户集合规则
const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: [true, '用户ID已存在，创建失败！']
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  job: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10
  },
  phone_number: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['root', 'admin']
  },
  password: {
    type: String,
    required: true
  },
  create_date: {
    type: Number,
    default: Date.now
  }
}, {
  versionKey: false
})

// 根据用户集合规则创建用户集合
const User = mongoose.model('User', userSchema)

// 注册数据格式校验
const validateUser = user => {
  // 定义对象验证规则
  const schema = {
    userid: Joi.string().regex(/^A[0-9]{4}$/).required().error(new Error('用户ID不符合验证规则')),
    username: Joi.string().min(2).max(10).required().error(new Error('用户姓名不符合规则')),
    gender: Joi.string().valid('male', 'female'),
    job: Joi.string().min(2).max(10).required().error(new Error('用户职务不符合规则')),
    phone_number: Joi.string().regex(/^[1][3456789]\d{9}$/).required().error(new Error('用户手机号不符合规则')),
    role: Joi.string().valid('root', 'admin'),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,15}$/).required().error(new Error('密码不符合验证规则'))
  }
  // 验证
  return Joi.validate(user, schema, {
    // 检测到所有错误
    abortEarly: false,
    // 允许对象包含被忽略的未知键
    allowUnknown: true
  })
}

// 登录数据格式校验
const validateLogin = user => {
	// 定义对象验证规则
	const schema = {
		userid: Joi.string().regex(/^A[0-9]{4}/).required().error(new Error('用户ID或密码错误')),
		password: Joi.string().regex(/^[a-zA-Z0-9]{6,15}$/).error(new Error('用户ID或密码错误'))
	}
	// 验证
	return Joi.validate(user, schema, {
		// 检测到错误立即返回
		abortEarly: true
	})
}

// 初始化一个root管理员
User.findOne({
	'userid': 'A1001'
}).then(async result => {
	if (result == null) {
		// 生成盐
		const salt = await bcrypt.genSalt(10)
		// 使用盐对密码进行加密
		const password = await bcrypt.hash('123456', salt)
    // 将此根用户添加至User集合中
		const user = await User.create({
			userid: 'A1001',
      username: '周志虎',
      gender: 'male',
			job: '药剂科主任',
			phone_number: '15056596227',
			role: 'root',
			password: password
		});
	}
})

// 导出用户集合, 数据格式验证规则,登录数据格式校验规则
module.exports = {
  User,
  validateUser,
  validateLogin
}