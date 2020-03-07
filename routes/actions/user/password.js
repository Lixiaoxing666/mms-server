// 引入 User 集合
const {
  User,
  validateLogin
} = require('../../../models/User')
// 引入 bcryptjs 第三方模块
const bcrypt = require('bcryptjs')

module.exports = async (req, res) => {
  // 定义服务器错误响应消息
  const serverError = {
    status: 500,
    message: '服务器端发生错误！'
  }
  // 从请求参数中提取用户ID
  // 从请求体中提取 旧密码、 新密码 及 确认型新密码
  const userid = req.params.id
  const {
    oldPassword,
    newPassword,
    checkPassword
  } = req.body
  // 验证用户ID及旧密码格式，准备进行登录验证
  const loginUser = {
    userid,
    password: oldPassword
  }
  const {
    error
  } = validateLogin(loginUser)
  // 若不正确，中断程序执行，响应客户端错误信息
  if (error) {
    return res.send({
      status: 400,
      message: '旧密码错误！(或非法更改传递管理员ID)'
    })
  }
  // 判断新密码和确认型新密码是否相等
  const isEqual = (newPassword === checkPassword)
  if (isEqual) {
    // 查询用户ID是否存在
    const user = await User.findOne({
      userid: userid
    }).catch(err => {
      res.send(serverError)
    })
    // 若用户ID存在，执行密码匹配验证; 不存在则响应 C 错误信息
    if (user) {
      const isCorrect = await bcrypt.compare(oldPassword, user.password).catch(error => {
        res.send(serverError)
      })
      if (isCorrect) {
        // 旧密码正确
        // 先进行加密
        const salt = await bcrypt.genSalt(10).catch(err => {
          res.send(serverError)
        })
        const finalPassword = await bcrypt.hash(newPassword, salt)
        // 开始更新数据
        const userInfo = await User.updateOne({
          userid
        }, {
          password: finalPassword
        }).catch(err => {
          res.send(serverError)
        })
        res.send({
          status: 200,
          message: '修改密码成功！',
        })
      } else {
        // 旧密码错误
        res.send({
          status: 400,
          message: '旧密码错误！'
        })
      }
    } else {
      // 旧密码错误！(或非法更改传递管理员ID)
      res.send({
        status: 400,
        message: '旧密码错误！(或非法更改传递管理员ID)'
      })
    }
  } else {
    res.send({status: 400, message: '两次新密码输入不一致，请重新输入！'})
  }
}