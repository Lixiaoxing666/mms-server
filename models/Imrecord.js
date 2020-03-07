// 引入 mongoose 模块
const mongoose = require('mongoose')

// 创建 入库记录 集合规则
const imrecordSchema = new mongoose.Schema({
  import_id: {
    type: String,
    required: true,
    unique: true
  },
  import_date: {
    type: Number,
    required: true
  },
  import_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// 根据 入库记录集合规则 创建入库记录集合
const Imrecord = mongoose.model('Imrecord', imrecordSchema)

// 导出 入库记录集合
module.exports = Imrecord