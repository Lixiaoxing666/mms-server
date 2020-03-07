// 引入 Source 集合
const Source = require('../../../models/Source')

module.exports = async (req, res) => {
  // req.body{ manu_id,manufacture,place,main_sale }
  console.log(req.body);

  // 判断厂商编号或厂商名称是否为空，有一个为空则终止程序，响应客户端错误消息
  if (!(req.body.manu_id || req.body.manufacturer)) {
    return res.send({
      status: 400,
      message: '添加失败！'
    })
  }
  // 查询同编号的厂商是否已存在
  const source = await Source.findOne({
    manu_id:req.body.manu_id
  }).catch(err => {
    res.send({
      status: 500,
      message: '添加失败！'
    })
  })
  // 如果已存在，响应客户端错误信息
  if (source) {
    return res.send({
      status: 400,
      message: '厂商信息已存在！'
    })
  }
  // 向数据库中添加厂商信息
  const newSource = await Source.create(req.body).catch(err => {
    res.send({
      status: 500,
      message: '添加失败！'
    })
  })
  res.send({
    data: newSource,
    status: 200,
    message: '添加成功！'
  })
}