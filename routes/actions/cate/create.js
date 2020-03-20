// 引入分类集合
const Cate = require('../../../models/Cate')
// 引入用户集合
const {
  User
} = require('../../../models/User')
// 引入 lodash 第三方模块
const _ = require('lodash')

module.exports = async (req, res) => {
  // req.body { cate_name, user_id}
  // 提取出 分类名称 和 创建人id
  req.body = _.pick(req.body, ['cate_name', 'userid'])
  const {
    cate_name,
    userid
  } = req.body
  if (cate_name.trim().length <= 0) {
    return res.send({
      status: 400,
      message: '分类名称格式不符'
    })
  }
  // 查询分类名称是否已存在
  let cate
  try {
    cate = await Cate.findOne({
      cate_name
    })
  } catch (error) {
    return res.send({
      status: 500,
      message: '添加失败！'
    })
  }
  // 已存在则响应客户端错误信息
  if (cate) {
    return res.send({
      status: 400,
      message: '分类已存在！'
    })
  }
  // 查询传递参数用户id是否存在
  let user
  try {
    user = await User.findOne({
      userid
    })
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '添加失败！'
    })
  }
  if (user) {
    // 定义分类ID
    let cate_id
    let cateCount
    try {
      cateCount = await Cate.countDocuments()
    } catch (error) {
      console.log(error)
      return res.send({
        status: 500,
        message: '添加失败！'
      })
    }
    if (cateCount) {
      let recentlyCate
      try {
        recentlyCate = (await Cate.find().sort('-create_date'))[0]
      } catch (error) {
        console.log(error)
        return res.send({
          status: 500,
          message: '添加失败！'
        })
      }
      const recentlyCateId = recentlyCate.cate_id
      cate_id = recentlyCateId - 0 + 1 + ''
    } else {
      cate_id = '1001'
    }
    // 分类创建者的 ObjectId
    const create_user = user._id
    let cate
    try {
      cate = await Cate.create({
        cate_id,
        cate_name,
        create_user
      })
    } catch (error) {
      console.log(error)
      return res.send({
        status: 500,
        message: '添加失败！'
      })
    }
    res.send({
      data: cate,
      status: 200,
      message: '添加成功！'
    })
  } else {
    res.send({
      status: 400,
      message: '添加失败！'
    })
  }
}