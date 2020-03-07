// 引入 bcryptjs 第三方模块
const bcrypt = require('bcryptjs')
// 引入 jwt token 工具
const JwtUtil = require('../../../public/utils/jwt')
// 引入用户集合及登录验证规则
const {
  User,
  validateLogin
} = require('../../../models/User')

module.exports = async (req, res) => {
  // 定义客户端错误 响应消息对象
  const clientError = {
    data: null,
    status: 400,
    message: '用户ID或密码错误！'
  }
  // 提取 用户ID 和 密码
  const {
    userid,
    password
  } = req.body
  // 验证 C 输入的 用户ID 和 密码 格式是否正确
  const {
    error
  } = validateLogin(req.body)
  // 若不正确，中断程序执行，响应客户端错误信息
  if (error) {
    return res.send({
      status: 400,
      message: '管理员ID或密码错误！'
    })
  }
  // 查询用户ID是否存在
  const user = await User.findOne({
    userid: userid
  }).catch(err => {
    res.send({
      data: null,
      status: 500,
      message: '服务端发生错误！'
    })
  })
  // 若用户ID存在，执行密码匹配验证; 不存在则响应 C 错误信息
  if (user) {
    const isCorrect = await bcrypt.compare(password, user.password).catch(error => {
      res.send({
        data: null,
        status: 500,
        message: '服务端发生错误！'
      })
    })
    if (isCorrect) {
      const _id = user._id
      const jwt = new JwtUtil(_id)
      const token = jwt.generateToken()
      const userInfo = {
        userid: user.userid,
        username: user.username,
        gender: user.gender,
        job: user.job,
        phone_number: user.phone_number,
        role: user.role,
        create_date: user.create_date
      }
      res.send({
        data: userInfo,
        status: 200,
        message: '登录成功！',
        token: token
      })
    } else {
      res.send(clientError)
    }
  } else {
    res.send(clientError)
  }
}