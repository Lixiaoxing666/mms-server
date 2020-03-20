// 引入 lodash 第三方模块
const _ = require('lodash')
// 引入 药品 集合
const Medicine = require('../../../models/Medicine')
// 引入 出库记录 集合
const Exrecord = require('../../../models/Exrecord')
// 引入 药品库存 集合
const Inventory = require('../../../models/Inventory')
// 引入 用户 集合
const {
  User
} = require('../../../models/User')

module.exports = async (req, res) => {
  let exRecord
  try {
    exRecord = await Exrecord.findOne({
      export_id: req.body.export_id
    })
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '查询出库信息失败！'
    })
  }
  if (exRecord) {
    return res.send({
      status: 400,
      message: '出库单号已存在！'
    })
  }
  let userInfo
  try {
    userInfo = await User.findOne({
      userid: req.body.export_user
    })
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: '查询管理员信息失败！'
    })
  }
  if (userInfo) {
    req.body.export_user = userInfo._id
    // 查询出库药品信息
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
      // 查询本次出库的药品是否已有库存信息(库存文档由 药批文号、生产日期、有效日期 决定)
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
      // 若已存在，进行库存数量统计
      // 若不存在，终止出库程序，响应客户端错误消息
      if (inventInfo) {
        if (req.body.med_count > inventInfo.med_count) {
          return res.send({
            status: 400,
            message: '符合出库规则的药品库存数量不足！'
          })
        }
        // 确保药品在成功出库以后再创建出库记录
        const med_count = inventInfo.med_count - req.body.med_count
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
        let exRecordInfo
        try {
          exRecordInfo = await Exrecord.create(req.body)
        } catch (error) {
          console.log(error)
          return res.send({
            status: 500,
            message: '创建出库记录失败！'
          })
        }
        if (med_count === 0) {
          try {
            await Inventory.deleteOne({
              _id: docId
            })
          } catch (error) {
            console.log(error);
            console.log('已完成药品出库库存更新操作，库存余量为 0 ，删除库存记录失败')
          }
        }
        res.send({
          data: exRecordInfo,
          status: 200,
          message: '出库记录创建成功！'
        })
      } else {
        res.send({
          status: 400,
          message: '暂无符合出库规则的药品，无法创建出库记录！'
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