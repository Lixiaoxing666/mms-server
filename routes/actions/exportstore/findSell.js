// 引入 入库记录 集合
const Exrecord = require('../../../models/Exrecord')

module.exports = async (req, res) => {
  // 查询参数 req.query{ pagesize, pagenum}
  // 提取 pagesize, pagenum
  let {
    pagesize,
    pagenum
  } = req.query
  // 若 pagesize, pagenum 有一个未传值，终止程序，响应客户端错误消息
  if (!(pagesize || pagenum)) {
    return res.send({
      status: 400,
      message: '查询药品出库(售出)记录列表失败！'
    })
  }
  // 根据查询参数查询列表,默认查询最新出库（售出）的 条目
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 查询符合条件药品出库记录总项数
  const total = await Exrecord.find({
    export_method: 'sell'
  }).countDocuments().catch(err => {
    res.send({
      status: 500,
      message: '查询药品出库(售出)记录列表失败！'
    })
  })
  const queryResult = await Exrecord.find({
    export_method: 'sell'
  }).populate('export_user').sort('-export_date').skip((pagenum - 1) * pagesize).limit(pagesize).catch(err => {
    res.send({
      status: 500,
      message: '查询药品出库(售出)记录列表失败！'
    })
  })
  res.send({
    data: {
      exportSellList: queryResult,
      total
    },
    status: 200,
    message: '查询药品出库(售出)记录列表成功！'
  })
}