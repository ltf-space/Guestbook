const { urlencoded } = require('body-parser')
const { request, response } = require('express')
const express = require('express')
const { data } = require('jquery')
const router = express.Router()
let {users,comments} = require('./models/user')

// comments.find().then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })
// comments.deleteMany({
//   name:'sdf'
// }).then( () => {
//   console.log('删除成功')
// }).catch(err => {
//   console.log(err)
// })


router.get('/',(request,response) => {//渲染首页
  response.render('index.html',{
    user:request.session.user,//展示当前用户
    arr:arr
  })
})
router.get('/login',(request,response) => {//渲染登录页
  response.render('login.html')
})
router.post('/login',(request,response) => {//登录请求
  // console.log(request.body)
  let body = request.body
  users.findOne({
    email:body.email,
    password:body.password
  }).then(res => {
    if(res){
      request.session.user = res
      return response.status(200).json({
        err_code:0,
        message:'登录成功'
      })
    }
    return response.status(201).json({
      err_code:1,
      message:'邮箱或者密码错误'
    })
  }).catch(err => {
    return response.status(500).json({
      err_code:500,
      message:'服务器忙，请稍后重试'
    })
  })

})
router.get('/register',(request,response) => {//渲染注册页
  response.render('register.html')
})
router.post('/register',(request,response) => {//注册请求
  let body = request.body
  // console.log(body)
  users.findOne({
    // 判断邮箱或者昵称是否存在
    $or:[
      {
        email:body.email
      },
      {
        nickname:body.nickname
      }
    ]
  }).then(res => {
    if(res){//从数据库中查找，如果res有数据说明已经存在
      return response.status(200).json({
        err_code:1,
        message:'邮箱或者昵称已存在'
      })
    }
    // 否则向数据库中插入数据
    new users(body).save().then(res => {
      // console.log(res)
      // 将用户信息保存到session的user中（保存登录状态）
      request.session.user = res
      return response.status (200).json({
        err_code:0,
        message:'成功'
      })
    }).catch(err => {
      return response.status(500).json({
        err_code:500,
        message:'服务器忙，请稍后重试'
      })
    })

  }).catch(err => {
    return response.status(500).json({
      err_code:500,
      message:'服务器忙，请稍后重试'
    })
  })
})
router.get('/goOut',(request,response) => {//退出登录
  // 清除登录状态session
  request.session.user = null
  // 重定向
  response.redirect('/')
})
router.get('/post',(request,response) => {//渲染发表留言页面
  if(request.session.user){
    response.render('post.html')
  }
  response.render('login.html')
})


let arr = []
router.post('/addMeg',(request,response) => {
  // console.log(request.body)
  let body = request.body
  if(!body){
    return response.status(500)
  }
  new comments(request.body).save().then(res => {
    console.log(res)
    arr.unshift(res)  
    response.redirect('/')
    return arr
    // return response.status(200)
  }).catch(err => {
    console.log(err)
  })
 
  // comments.find().then(res => {
  //   arr.unshift(res)  
  //   // console.log(arr)
  //   response.redirect('/')
  //   return arr
  // })

  
})

// 利用async await 方法
// router.post('/register',async (request,response) => {//注册请求
//   let body = request.body
//   try{
//     if(await users.findOne({ email:body.email })){
//       return response.status(200).json({
//         err_code:1,
//         message:'邮箱已存在'
//       })
//     }
//     if(await users.findOne({ nickname:body.nickname })){
//       return response.status(200).json({
//         err_code:2,
//         message:'昵称已存在'
//       })
//     }
//     await new users(body).save()
//     response.status(200).json({
//       err_code:0,
//       message:'成功'
//     })
//   }catch(err){
//     return response.status(500).json({
//       err_code:500,
//       message:'服务器忙，请稍后重试'
//     })
//   }
// })
module.exports = router