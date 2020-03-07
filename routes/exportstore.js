// 创建 export 路由模块
const exportstore = require('express').Router()

exportstore.get('/', require('./actions/exportstore/find'))
exportstore.get('/sell', require('./actions/exportstore/findSell'))
exportstore.get('/return', require('./actions/exportstore/findReturn'))
exportstore.post('/', require('./actions/exportstore/create'))


module.exports = exportstore