// 引入 用户 集合
const {
  User
} = require('../../../models/User')
// 引入 药品来源商 集合
const Source = require('../../../models/Source')

module.exports = async (req, res) => {
  let userCount
  try {
    userCount = await User.countDocuments()
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '获取系统管理员数量失败！'
    })
  }
  let sourceCount
  try {
    sourceCount = await Source.countDocuments()
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '获取药品来源商数量失败！'
    })
  }
  res.send({
    data: {
      userCount,
      sourceCount
    },
    status: 200,
    message: '获取系统管理员数量和药品来源商数量成功！'
  })
}