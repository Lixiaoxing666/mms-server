// 引入User集合
const {
  User
} = require('../../../models/User')

module.exports = async (req, res) => {
  // 若前端未传入要删除的用户ID, 终止程序，发送响应
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传入要删除的管理员ID！'
    })
  }
  // 从数据库中删除用户
  let user
  try {
    user = await User.deleteOne({
      userid: req.params.id
    })
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '删除失败！'
    })
  }
  res.send({
    data: user,
    status: 200,
    message: '删除成功！'
  })
}