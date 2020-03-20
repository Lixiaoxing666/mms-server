// 引入 药品库存 集合
const Inventory = require('../../../models/Inventory')

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
      message: '查询药品过期预警列表失败！'
    })
  }
  // 将 pagesize、pagenum 转换为 Number 类型
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 查询药品库存列表
  let storeList
  try {
    storeList = await Inventory.find().populate('med_info').sort('med_using_date')
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '查询药品库存列表失败！'
    })
  }
  // 获取库存列表总文档数
  const storeTotal = storeList ? storeList.length : 0
  if (storeList) {
    const dateNow = Date.now()
    // 获取过期预警库存文档
    let warningList = storeList.filter(item => {
      let disTime = item.med_using_date - dateNow
      if (disTime < 604800000) {
        return true
      }
    })
    const warningTotal = warningList.length
    // 数组裁剪实现分页效果
    warningList = warningList.splice((pagenum - 1) * pagesize, pagesize)
    res.send({
      data: {
        warningList,
        warningTotal,
        storeTotal
      },
      status: 200,
      message: '查询药品过期预警列表成功！'
    })
  } else {
    res.send({
      data: {
        warningList: null,
        warningTotal: 0,
        storeTotal
      },
      status: 200,
      message: '查询药品过期预警列表成功！'
    })
  }
}