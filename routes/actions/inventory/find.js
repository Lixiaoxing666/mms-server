// 引入 药品库存 集合
const Inventory = require('../../../models/Inventory')
// 引入 药品信息 集合
const Medicine = require('../../../models/Medicine')

module.exports = async (req, res) => {
  // 查询参数 req.query{ query, pagesize, pagenum}
  // 提取 query， pagesize, pagenum
  let {
    query,
    pagesize,
    pagenum
  } = req.query
  // 若 pagesize, pagenum 有一个未传值，终止程序，响应客户端错误消息
  if (!(pagesize || pagenum)) {
    return res.send({
      status: 400,
      message: '查询药品库存列表失败！'
    })
  }
  // 根据查询参数查询列表
  // 创建查询参数正则
  query = new RegExp(query, 'gi')
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 首先 query 参数查询药品信息表，匹配符合药品
  const medicineList = await Medicine.find({
    med_name: query
  }).catch(error => {
    res.send({
      status: 500,
      message: '查询药品信息列表失败！'
    })
  })
  // 初始化 total 、 queryResult 值
  let total = 0
  let queryResult = []
  // 如果 medicineList 不为空，循环查找每个药品的库存信息
  if (medicineList) {
    for (let item of medicineList) {
      let med_obj_id = item._id
      const count = await Inventory.find({
        med_info: med_obj_id
      }).countDocuments()
      total += count
      const currentResult = await Inventory.find({
        med_info: med_obj_id
      }).populate('med_info')
      queryResult = queryResult.concat(currentResult)
    }
  }
  // // 查询库存列表总条数
  // const total = await Inventory.find({
  //   med_name: query
  // }).countDocuments().catch(err => {
  //   res.send({
  //     status: 500,
  //     message: '查询药品库存列表失败！'
  //   })
  // })
  // // 查询符合条件的库存列表
  // const queryResult = await Inventory.find({
  //   med_name: query
  // }).populate('med_info').skip((pagenum - 1) * pagesize).limit(pagesize).catch(err => {
  //   res.send({
  //     status: 500,
  //     message: '查询药品库存列表失败！'
  //   })
  // })
  res.send({
    data: {
      storeList: queryResult,
      total
    },
    status: 200,
    message: '查询药品库存列表成功！'
  })
}