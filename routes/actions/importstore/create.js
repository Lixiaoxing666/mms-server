// 引入 lodash 第三方模块
const _ = require('lodash')
// 引入 药品 集合
const Medicine = require('../../../models/Medicine')
// 引入 入库记录 集合
const Imrecord = require('../../../models/Imrecord')
// 引入 药品库存 集合
const Inventory = require('../../../models/Inventory')
// 引入 用户 集合
const {
  User
} = require('../../../models/User')

module.exports = async (req, res) => {
  const imRecord = await Imrecord.findOne({
    import_id: req.body.import_id
  }).catch(err => {
    res.send({
      status: 500,
      message: '查询入库信息失败！'
    })
  })
  if (imRecord) {
    return res.send({
      status: 400,
      message: '入库单号已存在！'
    })
  }
  let userInfo
  try {
    userInfo = await User.findOne({
      userid: req.body.import_user
    })
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: '查询管理员信息失败！'
    })
  }
  if (userInfo) {
    req.body.import_user = userInfo._id
    // 查询入库药品信息
    let med_info
    try {
      med_info = await Medicine.findOne({
        med_id: req.body.med_id
      })
    } catch (error) {
      console.log(error)
      return res.send({
        status: 500,
        message: '查询药品信息失败！'
      })
    }
    if (med_info) {
      // 查询本次入库的药品是否已有库存信息(库存文档由 药批文号、生产日期、有效日期 决定)
      let inventInfo
      try {
        inventInfo = await Inventory.findOne({
          med_id: req.body.med_id,
          med_product_date: req.body.med_product_date,
          med_using_date: req.body.med_using_date
        })
      } catch (error) {
        console.log(error)
        return res.send({
          status: 500,
          message: '查询药品库存信息失败！'
        })
      }
      if (inventInfo) {
        // 若已存在，进行库存数量统计
        const med_count = inventInfo.med_count + req.body.med_count
        const docId = inventInfo._id
        let updatedInvent
        try {
          updatedInvent = await Inventory.updateOne({
            _id: docId
          }, {
            med_count
          })
        } catch (error) {
          console.log(error)
          return res.send({
            status: 500,
            message: '更新药品库存信息失败！'
          })
        }
        // 确保药品在成功入库以后再创建入库记录
        let imRecordInfo
        try {
          imRecordInfo = await Imrecord.create(req.body)
        } catch (error) {
          console.log(error)
          return res.send({
            status: 500,
            message: '创建入库记录失败！'
          })
        }
        res.send({
          data: imRecordInfo,
          status: 200,
          message: '入库记录创建成功！'
        })
      } else {
        // 若不存在，新建库存文档
        const newInventDoc = _.pick(req.body, ['med_id', 'med_product_date', 'med_using_date', 'med_count'])
        newInventDoc.med_name = med_info.med_name
        newInventDoc.med_info = med_info._id
        try {
          await Inventory.create(newInventDoc)
        } catch (error) {
          console.log(error)
          return res.send({
            status: 500,
            message: '更新药品库存信息失败！'
          })
        }
        // 确保药品在成功入库以后再添加入库记录
        let imRecordInfo
        try {
          imRecordInfo = await Imrecord.create(req.body)
        } catch (error) {
          console.log(error)
          return res.send({
            status: 500,
            message: '创建入库记录失败！'
          })
        }
        res.send({
          data: imRecordInfo,
          status: 200,
          message: '入库记录创建成功！'
        })
      }
    } else {
      return res.send({
        status: 400,
        message: '查询该药批文号的药品信息失败，请确认是否输入有误！'
      })
    }
  } else {
    res.send({
      status: 400,
      message: '管理员信息不存在（或非法更改传递管理员ID）！'
    })
  }
}