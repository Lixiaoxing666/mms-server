// 引入 joi 第三方验证模块
const Joi = require('joi')
// 引入 lodash 第三方对象处理模块
const _ = require('lodash')
// 引入User集合
const {
  User
} = require('../../../models/User')

module.exports = async (req, res) => {
  // // 若前端未传入要修改的用户ID, 终止程序，发送响应
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传入要修改的管理员ID！'
    })
  }
  // 剔除 用户ID 字段 
  req.body = _.pick(req.body, ['username', 'gender', 'job', 'phone_number', 'role'])
  // 验证各项字段值是否符合格式
  console.log('---开始验证字段格式---')
  const schema = {
    username: Joi.string().min(2).max(10).required().error(new Error('用户姓名不符合规则')),
    gender: Joi.string().valid('male', 'female'),
    job: Joi.string().min(2).max(10).required().error(new Error('用户职务不符合规则')),
    phone_number: Joi.string().regex(/^[1][3456789]\d{9}$/).required().error(new Error('用户手机号不符合规则')),
    role: Joi.string().valid('root', 'admin')
  }
  const {
    error
  } = Joi.validate(req.body, schema, {
    // 允许对象包含被忽略的未知键
    allowUnknown: true
  })
  // 若格式校验不通过，终止程序，响应客户端错误消息对象
  if (error) {
    return res.send({
      status: 400,
      message: '修改管理员信息失败！'
    })
  }
  // 从数据库中更新用户信息
  let user
  try {
    user = await User.updateOne({
      userid: req.params.id
    }, req.body)
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '修改管理员信息失败！'
    })
  }
  res.send({
    data: user,
    status: 200,
    message: '修改管理员信息成功！'
  })
}