// 引入 药品集合
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
      message: '未传递查询参数！'
    })
  }
  // 根据查询参数查询列表
  // 创建查询参数正则
  query = new RegExp(query, 'gi')
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 查询药品列表总条数
  let total
  try {
    total = await Medicine.find({
      med_name: query
    }).countDocuments()
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '查询药品列表失败！'
    })
  }
  // 查询符合条件的药品列表
  let queryResult
  try {
    queryResult = await Medicine.find({
      med_name: query
    }).populate('med_cate').skip((pagenum - 1) * pagesize).limit(pagesize)
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: '查询药品列表失败！'
    })
  }
  res.send({
    data: {
      medicineList: queryResult,
      total
    },
    status: 200,
    message: '查询药品列表成功！'
  })
}