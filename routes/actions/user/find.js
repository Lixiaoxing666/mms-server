// 引入 User 集合
const {
  User
} = require('../../../models/User')

module.exports = async (req, res, next) => {
  // 查询用户集合
  let userList
  try {
    userList = await User.find().select('userid username gender job phone_number role create_date')
  } catch (error) {
    console.log(error)
    return res.send({status: 500, message: '查询管理员列表失败！'})
  }
  res.send({
    data: {
      userList
    },
    status: 200,
    message: '查询成功！'
  })
}