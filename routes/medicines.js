// 创建 medicine 路由模块
const medicines = require('express').Router()

medicines.get('/', require('./actions/medicine/find'))
medicines.get('/:id', require('./actions/medicine/findOne'))
medicines.post('/', require('./actions/medicine/create'))
medicines.put('/:id', require('./actions/medicine/modify'))
medicines.delete('/:id', require('./actions/medicine/delete'))

module.exports = medicines