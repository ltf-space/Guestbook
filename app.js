const express = require('express')
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser');
let session = require('express-session')
const app = express()
// 开放目录
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

// 渲染后缀为html的文件
app.engine('html',require('express-art-template'))
// 默认就是views目录
app.set('views',path.join(__dirname,'./views/'))

// 配置解析post表单请求体插件（要在app.use(router)）之前
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 配置session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  // 置为false，只有当用户登陆的时候才会给其分配session
  saveUninitialized: false
}))


// 将router挂载到app
app.use(router)
app.listen(8000,(res) => {
  console.log('8000端口已启动')
})