// 创建 药品库存 路由模块
const inventory = require('express').Router()

inventory.get('/', require('./actions/inventory/find'))
inventory.get('/overdue', require('./actions/inventory/findOverDue'))
inventory.get('/overfloor', require('./actions/inventory/findOverFloor'))

module.exports = inventory