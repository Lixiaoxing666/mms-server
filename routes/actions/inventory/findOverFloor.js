// 引入 药品库存 集合
const Inventory = require('../../../models/Inventory')
// 引入 药品集合
const Medicine = require('../../../models/Medicine')
// 引入 lodash 第三方模块
const _ = require('lodash')

module.exports = async (req, res) => {
  // 查询参数 req.query{ query, pagesize, pagenum}
  // 提取 query， pagesize, pagenum
  let {
    pagesize,
    pagenum
  } = req.query
  // 若 pagesize, pagenum 有一个未传值，终止程序，响应客户端错误消息
  if (!(pagesize || pagenum)) {
    return res.send({
      status: 400,
      message: '查询药品库存预警列表失败！'
    })
  }
  // 查询药品列表
  const medicineList = await Medicine.find().populate('med_cate').catch(err => {
    res.send({
      status: 500,
      message: '查询药品信息列表失败！'
    })
  })
  // 声明空的药品库存下限预警列表
  let warningList = []
  // 对每一药品进行库存检索
  for (item of medicineList) {
    let storeCount = 0
    const mapList = await Inventory.find({
      med_id: item.med_id
    }).catch(err => {
      res.send({
        status: 500,
        message: '查询单药品库存信息时出错！'
      })
    })
    // 若药品有库存记录，则计算总库存余量，没有则默认为 0 
    if (mapList.length) {
      storeCount = mapList.reduce((total, item) => {
        return total + item.med_count
      }, 0)
    }
    // 若药品的库存总量小于该药品的库存下限，则计入库存下限预警列表
    if (item.inventory_floor > storeCount) {
      const warningItem = _.pick(item, ['med_id', 'med_name', 'med_cate', 'inventory_floor', 'source_name', 'source_place'])
      warningItem.inventory_count = storeCount
      warningList.push(warningItem)
    }
  }
  // 将库存下限预警列表按照库存余量从小到大排序，便于分页
  warningList.sort((a, b) => {
    return a.inventory_count - b.inventory_count
  })
  const warningTotal = warningList.length
  // 通过数组裁剪实现分页效果
  warningList = warningList.splice((pagenum - 1) * pagesize, pagesize)
  res.send({
    data: {
      warningList,
      warningTotal
    },
    status: 200,
    message: '查询药品库存下限预警列表成功！'
  })
}