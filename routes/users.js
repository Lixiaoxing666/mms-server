// 创建users路由处理模块
const users = require('express').Router()

// 查询整个用户集合信息
users.get('/', require('./actions/user/find'))
// 根据用户ID查询用户信息
users.get('/:id', require('./actions/user/findOne'))
// 创建用户
users.post('/', require('./actions/user/create'))
// 根据用户ID修改用户信息
users.put('/:id', require('./actions/user/modify'))
// 根据用户ID删除用户
users.delete('/:id', require('./actions/user/delete'))
// 已登录用户修改密码
users.put('/password/:id', require('./actions/user/password'))

module.exports = users