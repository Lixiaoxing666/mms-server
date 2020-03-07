// 创建 cate 路由处理模块
const cates = require('express').Router()

cates.get('/', require('./actions/cate/find'))
cates.get('/:id', require('./actions/cate/findOne'))
cates.post('/', require('./actions/cate/create'))
cates.put('/:id', require('./actions/cate/modify'))
cates.delete('/:id', require('./actions/cate/delete'))

module.exports = cates