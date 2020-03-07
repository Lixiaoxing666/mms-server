// 引入 mongoose 模块
const mongoose = require('mongoose')

// 创建 出库记录 集合规则
const exrecordSchema = new mongoose.Schema({
  export_id: {
    type: String,
    required: true,
    unique: true
  },
  export_date: {
    type: Number,
    required: true
  },
  export_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  export_user_name: {
    type: String,
    required: true
  },
  export_method: {
    type: String,
    enum: ['sell', 'return']
  },
  med_id: {
    type: String,
    required: true
  },
  med_product_date: {
    type: Number,
    required: true
  },
  med_using_date: {
    type: Number,
    required: true
  },
  med_count: {
    type: Number,
    required: true
  },
  total_money: {
    type: Number,
    required: true
  }
})

// 根据 出库记录集合规则 创建入库记录集合
const Exrecord = mongoose.model('Exrecord', exrecordSchema)

// 导出 出库记录集合
module.exports = Exrecord