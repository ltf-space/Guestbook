const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test');
const Schema = mongoose.Schema
const newSchema = new Schema({  
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  nickname:{
    type:String,
    required:true
  },
  create_time:{
    type:Date,
    // 这里不要用Date.now()，否则会立刻调用
    default:Date.now
  },
  last_time:{
    type:Date,
    default:Date.now
  },
  // 头像
  avatar:{
    type:String,
    default:'../public/img/avatar-default.png'
  },
  // 评论
  message:{
    type:String,
    default:''
  },
  gender:{
    type:Number,
    enum:[-1,0,1],
    default:-1
  },
  birthday:{
    type:Date
  },
  status:{
    type:Number,
    // 0:没有权限限制，1:不可以评论，2:不可以登录
    enum:[0,1,2],
    default:0
  }
})
const newCom = new Schema({
  name:{
    type:String,
    required:true
  },
  message:{
    type:String,
    default:''
  }
})

// 登录表
let users = mongoose.model('User',newSchema)
// 评论表
let comments = mongoose.model('Comment',newCom)
module.exports= {users,comments}