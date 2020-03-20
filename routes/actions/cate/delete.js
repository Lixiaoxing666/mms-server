// 引入分类集合
const Cate = require('../../../models/Cate')

module.exports = async (req, res) => {
  // req.params.id
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递要删除的分类编号！'
    })
  }
  let cate
  try {
    cate = await Cate.findOne({
      cate_id: req.params.id
    })
  } catch (error) {
    console.log(error)
    return res.send({
      status: 500,
      message: '查询删除信息失败！'
    })
  }
  if (cate) {
    try {
      await Cate.deleteOne({
        cate_id: req.params.id
      })
    } catch (error) {
      console.log(error)
      return res.send({
        status: 500,
        message: '删除失败！'
      })
    }
    res.send({
      status: 200,
      message: '删除成功！'
    })
  } else {
    res.send({
      status: 400,
      message: '所要删除的分类编号不存在（或非法更改传递参数！）'
    })
  }
}