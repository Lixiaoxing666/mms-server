// 引入分类集合
const Cate = require('../../../models/Cate')

module.exports = async (req, res) => {
  //req.params.id
  // 若未传递分类ID，中断程序，响应客户端错误消息
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递查询参数！'
    })
  }
  // 查询分类信息
  const cateInfo = await Cate.findOne({
    cate_id: req.params.id
  }).populate('create_user').catch(err => {
    res.send({
      status: 500,
      message: '查询分类信息失败！'
    })
  })
  if (cateInfo) {
    res.send({
      data: cateInfo,
      status: 200,
      message: '查询分类信息成功！'
    })
  } else {
    res.send({
      status: 400,
      message: '查询分类信息失败(分类信息不存在)！'
    })
  }
}