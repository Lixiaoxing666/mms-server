// 引入 入库记录 集合
const Imrecord = require('../../../models/Imrecord')
// 引入 用户 集合
const {
  User
} = require('../../../models/User')

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
      message: '查询药品入库记录列表失败！'
    })
  }
  // 根据查询参数查询列表
  // 创建查询参数正则
  query = new RegExp(query, 'gi')
  pagesize = pagesize - 0
  pagenum = pagenum - 0
  // 首先用 query 参数查询用户表，匹配符合用户
  const userList = await User.find({
    username: query
  }).catch(err => {
    res.send({
      status: 500,
      message: '查询管理员信息列表失败！'
    })
  })
  // 初始化 total 、 queryResult 值
  let total = 0
  let queryResult = []
  // 如果 userList 不为空，循环查找每个管理员的入库记录
  if (userList) {
    for (let item of userList) {
      let user_obj_id = item._id
      const count = await Imrecord.find({
        import_user: user_obj_id
      }).countDocuments()
      total += count
      const currentResult = await Imrecord.find({
        import_user: user_obj_id
      }).populate('import_user')
      queryResult = queryResult.concat(currentResult)
    }
  }
  // 裁剪数组实现分页效果
  queryResult = queryResult.splice((pagenum - 1) * pagesize, pagesize)
  // // 查询药品入库记录总条数
  // const total = await Imrecord.find({
  //   import_user_name: query
  // }).countDocuments().catch(err => {
  //   res.send({
  //     status: 500,
  //     message: '查询药品入库记录列表失败！'
  //   })
  // })
  // // 查询符合条件的药品入库记录列表
  // const queryResult = await Imrecord.find({
  //   import_user_name: query
  // }).populate('import_user').sort('-import_date').skip((pagenum - 1) * pagesize).limit(pagesize).catch(err => {
  //   res.send({
  //     status: 500,
  //     message: '查询药品入库记录列表失败！'
  //   })
  // })
  res.send({
    data: {
      importList: queryResult,
      total
    },
    status: 200,
    message: '查询药品入库记录列表成功！'
  })
}