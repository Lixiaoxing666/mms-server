// 引入分类集合
const Cate = require('../../../models/Cate')

module.exports = async (req, res) => {
  // 分类id --> req.params.id
  // 新的分类名称 --> req.body.cate_name
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递分类编号！'
    })
  }
  if (req.body.cate_name.trim().length > 0) {
    let cate
    try {
      cate = await Cate.findOne({
        cate_id: req.params.id
      })
    } catch (error) {
      console.log(error)
      return res.send({
        status: 500,
        message: '查询分类信息失败！'
      })
    }
    if (cate) {
      let updateCateInfo
      try {
        updateCateInfo = await Cate.updateOne({
          cate_id: req.params.id
        }, {
          cate_name: req.body.cate_name
        })
      } catch (error) {
        console.log(error)
        return res.send({
          status: 500,
          message: '修改分类信息失败！'
        })
      }
      res.send({
        data: updateCateInfo,
        status: 200,
        message: '修改分类信息成功！'
      })
    } else {
      res.send({
        status: 400,
        message: '非法更改传递分类编号！'
      })
    }
  } else {
    res.send({
      status: 400,
      message: '分类名称格式有误，添加失败！'
    })
  }
}