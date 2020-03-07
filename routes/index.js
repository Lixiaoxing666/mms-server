// 路由集中模块
module.exports = app => {
  app.get('/getIdentifyCode', require('./actions/other/getIdentifyCode'))
  app.post('/login', require('./actions/other/login'))
  app.get('/leftcount', require('./actions/other/UandC_count'))
  app.use('/users', require('./users'))
  app.use('/sources', require('./sources'))
  app.use('/cates', require('./cates'))
  app.use('/medicines', require('./medicines'))
  app.use('/importstore', require('./importstore'))
  app.use('/exportstore', require('./exportstore'))
  app.use('/inventory', require('./inventory'))
}