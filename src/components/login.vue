<template>
  <div class="login-container">
    <div class="left">
      <img class="left-img" src="@/assets/loginpageimage.png" alt="">
    </div>
    <div class="right">
        <h1 class="login-text" >登陆</h1>
        <div class="small-text">没有账号?去 <router-link to="/register"><span style="text-decoration: underline;">注册!</span></router-link></div>
        <div class="form-box">
          <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-width="auto"
            label-position="left"
          >
            <el-form-item label="手机号码" prop="phone_number">
              <el-input v-model="form.phone_number"  />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input  type="password" v-model="form.password" />
            </el-form-item>
            <el-form-item>
              <el-button class="login_btn" color="#738490" size="large" type="primary" @click="handleLoginClick">登陆</el-button>
            </el-form-item>
          
          </el-form>
        </div>
         <div class='small-text'><el-icon><ArrowLeft /></el-icon> <router-link to="/">返回首页</router-link></div>
      </div>
   
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {ArrowLeft} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const router = useRouter()
const form = ref({
  phone_number:"",
  password:''
})

// 手机号 自定义校验规则
const phoneNumber = (rule, value, callback)=>{
  console.log(value)
  if (value.trim().length === 11 ) {
    callback()
  }
  else {
    callback(new Error('手机号格式不正确！'))
  }
}
const rules = {
  phone_number:[{required: true, validator: phoneNumber, trigger: 'blur'}],
  password: [{ required: true, message:'密码不能为空', trigger: 'blur' },
              { min:6, message:'密码需大于6位', trigger: 'blur' }],
}

const ruleFormRef = ref(null)
// 点击login
  const handleLoginClick = () =>{
    const { phone_number, password } = form.value
    // 前端表单校验
    ruleFormRef.value.validate(async(valid) => {
      if (valid) {
        // 通过->发请求 getUserInfo
        const result = await userStore.getUserInfo({ phone_number, password })
          console.log("......", result)
          if (result.code===200){
            router.push('/') 
          }
          
      } else {
        // 未通过
        ElMessage.error('验证不通过！')
      }
    })
}




// export default {
 
//   name: 'Login',
//   props: {msg: String},
//   data(){
//     return{}
//   },
//   mounted(){},
//   methods:{}
 
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  margin: 0;
  
}
.login-text{
  margin: 0 ;
  padding: 0;
}
.left{
  width: 60%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.left-img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)); 
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) );     
}
.right{
  flex-grow: 1;
  display: flex;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}
.form-box{
  /* border: 1px solid #333; */
  background: #fff;
  width: 60%;
  padding: 20px;
  border-radius: 8px;


  /* box-shadow: 5px 5px 5px 5px rgba(214, 212, 212, 0.75); */
}
.login_btn{
  width: 100%;
}
.small-text{
  text-align: center;
  font-size: 14px;
  color: #726c6c;
}
/*
<div class="gradient-overlay"></div>
.gradient-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 50%;  渐变覆盖层的起始位置，这里是容器的中间位置 
    background-image: linear-gradient(to left, rgb(255, 255, 255, 1), rgba(255, 255, 255, 0)); 从白色到透明的渐变 
    z-index: 1; 确保覆盖在图片上方 
    }
*/
   





</style>