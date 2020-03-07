// 引入 药品集合
const Medicine = require('../../../models/Medicine')

module.exports = async (req, res) => {
  // req.params.id
  console.log(req.params.id);
  
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递要删除的药品其批准文号！'
    })
  }
  const medicine = await Medicine.findOne({
    med_id: req.params.id
  }).catch(err => {
    res.send({
      status: 500,
      message: '查询删除信息失败！'
    })
  })
  if (medicine) {
    Medicine.deleteOne({
      med_id: req.params.id
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
      message: '所要删除的药品其批准文号不存在（或非法更改传递参数！）'
    })
  }
}