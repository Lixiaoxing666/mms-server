// 导入 mongoose 第三方模块
const mongoose = require('mongoose')

// 创建 药品库存 集合规则
// 药品库存开辟新文档的规则为：
// 1.不同药品
// 2.同一药品（药品批准文号），生产日期 或 有效期限不同
const inventorySchema = new mongoose.Schema({
  med_id: {
    type: String,
    required: true
  },
  med_name: {
    type: String,
    required: true
  },
  med_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
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
  }
})

// 根据 药品库存集合规则 创建药品库存集合
const Inventory = mongoose.model('Inventory', inventorySchema)

// 导出 药品库存 集合
module.exports = Inventory