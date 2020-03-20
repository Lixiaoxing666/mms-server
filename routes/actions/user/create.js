// 引入User集合 以及 注册验证规则
const {
  User,
  validateUser
} = require('../../../models/User')
// 引入 bcryptjs 第三方加密模块
const bcrypt = require('bcryptjs')

module.exports = async (req, res) => {
  // 定义服务端错误 响应消息对象
  const serverError = {
    status: 500,
    message: '服务端发生错误！'
  }
  // 查询是否已存在该姓名的用户
  let user
  try {
    user = await User.findOne({
      username: req.body.username
    })
  } catch (error) {
    console.log(error)
    return res.send(serverError)
  }
  // 若已存在，则中断程序执行 相应 C 错误信息
  if (user) {
    return res.send({
      status: 400,
      message: '已存在该管理员！'
    })
  }
  // 生成新用户的 userid
  let recentlyUser
  try {
    recentlyUser = (await User.find().sort('-create_date'))[0]
  } catch (error) {
    console.log(error)
    return res.send(serverError)
  }
  const recentlyUserId = recentlyUser.userid
  let newUserId
  if (recentlyUserId[1] === '1') {
    newUserId = 'A2001'
  } else {
    newUserId = 'A' + (recentlyUserId.slice(1) - 0 + 1)
  }
  // 定义新创建的用户密码为 123456
  const newUserPassword = '123456'
  const newUser = {
    userid: newUserId,
    username: req.body.username,
    job: req.body.job,
    gender: req.body.gender,
    phone_number: req.body.phone_number,
    role: req.body.role,
    password: newUserPassword
  }
  // 验证用户注册格式是否正确
  const {
    error
  } = validateUser(newUser)
  // 若不正确，中断程序执行，响应客户端错误信息
  if (error) {
    return res.send({
      status: 400,
      message: '添加管理员失败'
    })
  }
  // 密码加密
  let salt
  try {
    salt = await bcrypt.genSalt(10)
  } catch (error) {
    console.log(error)
    return res.send(serverError)
  }
  let finalPassword
  try {
    finalPassword = await bcrypt.hash(newUserPassword, salt)
  } catch (error) {
    console.log(error)
    return res.send(serverError)
  }
  newUser.password = finalPassword
  // 向数据库添用户
  try {
    await User.create(newUser)
  } catch (error) {
    console.log(error)
    return res.send(serverError)
  }
  res.send({
    data: {
      userid: newUserId,
      username: req.body.username,
      job: req.body.job,
      gender: req.body.gender,
      phone_number: req.body.phone_number,
      role: req.body.role
    },
    status: 200,
    message: '添加管理员成功！'
  })
}