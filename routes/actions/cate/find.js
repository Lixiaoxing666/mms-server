// 引入分类集合
const Cate = require('../../../models/Cate')

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
      message: '查询分类列表失败！'
    })
  }
  // 根据查询参数查询列表
  // 创建查询参数正则
  query = new RegExp(query, 'gi')
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 查询分类列表总条目
  const total = await Cate.find({
    cate_name: query
  }).countDocuments().catch(err => {
    res.send({
      status: 500,
      message: '查询分类列表失败！'
    })
  })
  // 查询符合条件的分类列表
  const queryResult = await Cate.find({
    cate_name: query
  }).populate('create_user').skip((pagenum - 1) * pagesize).limit(pagesize).catch(err => {
    res.send({
      status: 500,
      message: '查询分类列表失败！'
    })
  })
  res.send({
    data: {
      cateList: queryResult,
      total
    },
    status: 200,
    message: '查询分类列表成功！'
  })
}