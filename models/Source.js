// 导入 mongoose 第三方模块
const mongoose = require('mongoose')

// 创建药品厂商集合规则
const sourceSchema = new mongoose.Schema({
  manu_id:{
    type: String,
    required: true,
    unique: [true, '厂商id已存在，创建失败！']
  },
  manufacturer: {
    type: String,
    required: true
  },
  place: String,
  main_sale: String
})

// 根据药品厂商集合规则创建 Source 集合
const Source = mongoose.model('Source', sourceSchema)

module.exports = Source