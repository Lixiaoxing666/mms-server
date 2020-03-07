// 导入 mongoose 第三方模块
const mongoose = require('mongoose')

// 创建分类集合规则
const cateSchema = new mongoose.Schema({
  cate_id: {
    type: String,
    required: true,
    unique: true
  },
  cate_name: {
    type: String,
    required: true,
    unique: true
  },
  create_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  create_date: {
    type: Number,
    default: Date.now
  }
})

const Cate = mongoose.model('Cate', cateSchema)

module.exports = Cate