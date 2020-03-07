// 创建 import 路由模块
const importstore = require('express').Router()

importstore.get('/', require('./actions/importstore/find'))
importstore.post('/', require('./actions/importstore/create'))


module.exports = importstore