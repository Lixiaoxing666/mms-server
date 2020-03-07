// 引入 Source 集合
const Source = require('../../../models/Source')

module.exports = async (req, res) => {
  // req.params.id
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递要删除的厂商编号！'
    })
  }
  const source = await Source.findOne({
    manu_id: req.params.id
  }).catch(err => {
    res.send({
      status: 500,
      message: '查询删除信息失败！'
    })
  })
  if (source) {
    Source.deleteOne({
      manu_id: req.params.id
    }).catch(err => {
      res.send({
        status: 500,
        message: '删除失败！'
      })
    })
    res.send({
      status: 200,
      message: '删除成功！'
    })
  } else {
    res.send({
      status: 400,
      message: '所要删除的厂商编号不存在（或非法更改传递参数！）'
    })
  }
}