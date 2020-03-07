// 引入 User 集合
const {
  User
} = require('../../../models/User')

module.exports = async (req, res) => {
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递查询参数！'
    })
  }
  const userInfo = await User.findOne({
    userid: req.params.id
  }).select('userid username gender job phone_number role create_date').catch(err => {
    res.send({
      status: 500,
      message: '查询管理员信息失败！'
    })
  })
  if (userInfo) {
    res.send({
      data: userInfo,
      status: 200,
      message: '查询成功！'
    })
  } else {
    res.send({
      status: 400,
      message: '查询失败(不存在该管理员)！'
    })
  }
}