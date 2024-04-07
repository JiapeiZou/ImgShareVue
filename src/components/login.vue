<template>
  <div class="login-container">
    <div class="left">
      <img class="left-img" src="@/assets/loginpageimage.png" alt="">
    </div>
    <div class="logo">
      <img class="logo-img" src="@/assets/logo.png" alt="">
      <span class="logo-text">IMGSHARE</span>
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
              <el-button class="login_btn" color="#738490" size="large" type="primary" @click="handleLoginClick">登 陆</el-button>
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
  if (value.trim().length === 11 ) {
    callback()
  }
  else {
    callback(new Error('手机号格式不正确！'))
  }
}
// ---自定义校验规则: 排除空格---
function noSpaceValidator(rule, value, callback) {
  if (/\s/.test(value)) {
    callback(new Error('输入不能包含空格'));
  } else {
    callback();
  }
}
// ---校验规则---
const rules = {
  phone_number:[{required: true, validator: phoneNumber, trigger: 'blur'},
                {validator: noSpaceValidator, trigger: 'blur'}],
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
          if (result.code===200){
            router.push('/') 
          }
      } else {
        // 未通过
        ElMessage.error('验证不通过！')
      }
    })
}
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
.logo{
  position: absolute;
  left: 20px;
  top: 20px;
  color: #fff;
  font-size: 26px;
  display: flex;
  justify-items: center;
  align-items: center;

}
.logo-img{
  width:50px ;
  height: 50px;
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
  background: #fff;
  width: 60%;
  padding: 20px;
  border-radius: 8px;
}
.login_btn{
  width: 100%;
  color: #fff;
}
.small-text{
  text-align: center;
  font-size: 14px;
  color: #726c6c;
}
</style>