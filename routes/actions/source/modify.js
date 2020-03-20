// 引入 Source 集合
const Source = require('../../../models/Source')

module.exports = async (req, res) => {
  //req.params.id
  if (!req.params.id) {
    return res.send({
      status: 400,
      message: '请传递厂商编号！'
    })
  }
  if (req.params.id.trim().length > 0) {
    let source
    try {
      source = await Source.findOne({
        manu_id: req.params.id
      })
    } catch (error) {
      console.log(error);
      return res.send({
        status: 500,
        message: '更改厂商信息失败！'
      })
    }
    if (source) {
      let updatedSourceInfo
      try {
        updatedSourceInfo = await Source.updateOne({
          manu_id: req.params.id
        }, req.body)
      } catch (error) {
        console.log(error);
        return res.send({
          status: 500,
          message: '更改厂商信息失败！'
        })
      }
      res.send({
        status: 200,
        message: '更改厂商信息成功！'
      })
    } else {
      res.send({
        status: 400,
        message: '非法更改传递厂商编号！'
      })
    }
  } else {
    res.send({
      status: 400,
      message: '非法更改传递厂商编号！'
    })
  }
}