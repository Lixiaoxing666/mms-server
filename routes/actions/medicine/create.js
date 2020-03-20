// 引入 药品集合
const Medicine = require('../../../models/Medicine')

// 引入分类集合
const Cate = require('../../../models/Cate')

module.exports = async (req, res) => {
  console.log(req.body)
  // 提取药品编号，查询是否已存在
  const med_id = req.body.med_id
  let medicine
  try {
    medicine = await Medicine.findOne({
      med_id
    })
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: '查询药品集合失败！'
    })
  }
  if (medicine) {
    return res.send({
      status: 400,
      message: '药品信息已存在！'
    })
  }
  // 根据 cate_id 查询分类的 ObjectId
  const cate_id = req.body.med_cate
  let cateInfo
  try {
    cateInfo = await Cate.findOne({
      cate_id
    })
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '查询分类信息失败！'
    })
  }
  // 将 med_cate 的值更改为 分类文档 的 ObjectId 存入数据库，方便联合查询
  req.body.med_cate = cateInfo._id
  // 向药品集合中添加文档（药品信息）
  let medicineInfo
  try {
    medicineInfo = await Medicine.create(req.body)
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '添加药品信息失败！'
    })
  }
  res.send({
    data: medicineInfo,
    status: 200,
    message: '添加药品信息成功！'
  })
}