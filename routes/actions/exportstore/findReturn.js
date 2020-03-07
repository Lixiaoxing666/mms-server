// 引入 入库记录 集合
const Exrecord = require('../../../models/Exrecord')

module.exports = async (req, res) => {
  // 只查询最新 4 条退货记录
  const queryResult = await Exrecord.find({
    export_method: 'return'
  }).populate('export_user').sort('-export_date').limit(4).catch(err => {
    res.send({
      status: 500,
      message: '查询药品出库(退货)记录列表失败！'
    })
  })
  res.send({
    data: {
      exportReturnList: queryResult
    },
    status: 200,
    message: '查询药品出库(退货)记录列表成功！'
  })
}