// 引入 Source 集合
const Source = require('../../../models/Source')

module.exports = async (req, res) => {
  //req.params.id
  // 若未传递厂商ID，中断程序，响应客户端错误消息
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递查询参数！'
    })
  }
  // 查询厂商信息
  const sourceInfo = await Source.findOne({
    manu_id: req.params.id
  }).catch(err => {
    res.send({
      status: 500,
      message: '查询厂商信息失败！'
    })
  })
  if (sourceInfo) {
    res.send({
      data: sourceInfo,
      status: 200,
      message: '查询厂商信息成功！'
    })
  } else {
    res.send({
      status: 400,
      message: '查询厂商信息失败！'
    })
  }
}