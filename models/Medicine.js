// 导入 mongoose 第三方模块
const mongoose = require('mongoose')

// 创建 药品 集合规则
const medicineSchema = new mongoose.Schema({
  med_id: {
    type: String,
    required: true,
    unique: true
  },
  med_name: {
    type: String,
    required: true
  },
  med_cate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cate'
  },
  dosage_form: {
    type: String,
    required: true
  },
  specification: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  min_unit: {
    type: String,
    required: true
  },
  inventory_up: {
    type: Number,
    default: 0
  },
  inventory_floor: {
    type: Number,
    required: true
  },
  source_name: String,
  source_place: String,
  import_price: {
    type: Number,
    default: 0
  },
  export_price: {
    type: Number,
    default: 0
  },
  otc: Boolean,
  remark: {
    type: String,
    maxlength: 300
  },
  create_date: {
    type: Number,
    default: Date.now
  }
})

// 根据 药品集合规则 创建 药品集合
const Medicine = mongoose.model('Medicine', medicineSchema)

module.exports = Medicine