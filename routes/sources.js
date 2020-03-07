// 引入 express 第三方模块
// 创建 source 路由模块
const sources = require('express').Router()

sources.get('/', require('./actions/source/find'))
sources.get('/:id', require('./actions/source/findOne'))
sources.post('/', require('./actions/source/create'))
sources.put('/:id', require('./actions/source/modify'))
sources.delete('/:id', require('./actions/source/delete'))

module.exports = sources