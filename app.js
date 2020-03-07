// 引入 express 第三方模块
const express = require('express')

// 引入mongoose 第三方模块
const mongoose = require('mongoose')

// 引入 express-session 第三方模块 处理用户登录记录 -----> session + cookie 登录验证机制
// const session = require('express-session')

// 引入 jwt token 工具
const JwtUtil = require('./public/utils/jwt')

// 引入 req.body 处理模块 body-parser
const bodyParser = require('body-parser')

// 引入 req.body 处理模块 multer (for parsing multipart/form-data)   ******用于上传文件
// const multer = require('multer')
// const upload = multer()
// app.post('/profile', upload.array(), function (req, res, next) {
//   console.log(req.body)
//   res.json(req.body)
// })

// 创建服务器实例
const app = express()

// 设置跨域和响应数据格式 // Access-Control-Allow-Credentials
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', '3.2.1')
  if (req.method == 'OPTIONS') res.sendStatus(200)
  /*让options请求快速返回*/
  else next()
})

app.use((req, res, next) => {
  if (req.url !== '/login' && req.url !== '/getIdentifyCode') {
    // console.log(req.headers.authorization); // token在这里
    const token = req.headers.authorization
    const jwt = new JwtUtil(token)
    const result = jwt.verifyToken()
    if (result === 'err') {
      res.send({
        status: 403,
        message: '登录已过期，请重新登录！'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// 配置 session
// app.use(session({ resave: false, saveUninitialized: true, secret: 'secret key' }))

// 解析请求体 req.body
// (for for parsing application/x-www-form-urlencoded)  ******for 序列化字符窜
app.use(bodyParser.urlencoded({
  extended: false
}))
// for parsing application/json  ******for json字符串
app.use(bodyParser.json())

// 连接 MongoDB 数据库
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/mms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('数据库连接成功！'))
  .catch(() => {
    console.log('数据库连接失败！')
  })

// 引入路由模块
require('./routes')(app)

// 开启服务器端口监听
app.listen(3000, () => {
  console.log('服务器启动成功！')
})