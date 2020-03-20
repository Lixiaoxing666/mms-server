// 引入 药品集合
const Medicine = require('../../../models/Medicine')
// 引入 分类集合
const Cate = require('../../../models/Cate')
// 引入 lodash 第三方模块
const _ = require('lodash')

module.exports = async (req, res) => {
  //req.params.id
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递药品批准文号！'
    })
  }
  if (req.params.id.trim().length > 0) {
    let medicine
    try {
      medicine = await Medicine.findOne({
        med_id: req.params.id
      })
    } catch (error) {
      console.log(error);
      return res.send({
        status: 500,
        message: '更改药品信息失败！'
      })
    }
    if (medicine) {
      // 根据 cate_id 查询分类的 ObjectId
      const cate_id = req.body.med_cate
      let cateInfo
      try {
        cateInfo = await Cate.findOne({
          cate_id
        })
      } catch (error) {
        console.log(error);
        return res.send({
          status: 500,
          message: '查询分类信息失败！'
        })
      }
      // 将 med_cate 的值更改为 分类文档 的 ObjectId 存入数据库，方便联合查询
      req.body.med_cate = cateInfo._id
      req.body = _.pick(req.body, ['med_name', 'med_cate', 'dosage_form', 'specification', 'unit', 'min_unit', 'inventory_up', 'inventory_floor', 'source_name', 'source_place', 'import_price', 'export_price', 'otc', 'remark'])
      let updatedMedicineInfo
      try {
        updatedMedicineInfo = await Medicine.updateOne({
          med_id: req.params.id
        }, req.body)
      } catch (error) {
        console.log(error)
        return res.send({
          status: 500,
          message: '更改药品信息失败！'
        })
      }
      res.send({
        status: 200,
        message: '更改药品信息成功！'
      })
    } else {
      res.send({
        status: 400,
        message: '非法更改传递药品批准文号！'
      })
    }
  } else {
    res.send({
      status: 400,
      message: '非法更改传递药品批准文号！'
    })
  }
}