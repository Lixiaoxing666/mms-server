// 引入 Source 集合
const Source = require('../../../models/Source')

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
      message: '查询厂商列表失败！'
    })
  }
  // 根据查询参数查询列表
  // 创建查询参数正则
  query = new RegExp(query, 'gi')
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 查询厂商列表总条数
  let total
  try {
    total = await Source.find({
      manufacturer: query
    }).countDocuments()
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: '查询厂商列表失败！'
    })
  }
  // 查询符合条件的厂商列表
  let queryResult
  try {
    queryResult = await Source.find({
      manufacturer: query
    }).skip((pagenum - 1) * pagesize).limit(pagesize)
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '查询厂商列表失败！'
    })
  }
  res.send({
    data: {
      sourceList: queryResult,
      total
    },
    status: 200,
    message: '查询厂商列表成功！'
  })
}