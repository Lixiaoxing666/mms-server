// 引入 药品集合
const Medicine = require('../../../models/Medicine')

module.exports = async (req, res) => {
  //req.params.id
  // 若未传递药品批准文号，中断程序，响应客户端错误消息
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递药品批准文号！'
    })
  }
  // 查询药品信息
  const medicineInfo = await Medicine.findOne({
    med_id: req.params.id
  }).populate('med_cate').catch(err => {
    res.send({
      status: 500,
      message: '查询药品信息失败！'
    })
  })
  if (medicineInfo) {
    res.send({
      data: medicineInfo,
      status: 200,
      message: '查询药品信息成功！'
    })
  }else {
    res.send({
      status: 400,
      message: '查询药品信息失败(该药品信息不存在)！'
    })
  }
}