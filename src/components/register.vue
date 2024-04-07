<template>
  <div class="register-container">
    <div class="left">
      <img class="left-img" src="@/assets/registerpageimage.png" alt="">
    </div>
    <div class="logo">
      <img class="logo-img" src="@/assets/logo.png" alt="">
      <span class="logo-text">IMGSHARE</span>
    </div>
    <div class="right">
      <h1 class="login-text">注册</h1>
      <div class="small-text">已有账号？立即 <router-link to="/login"><span style="text-decoration: underline;">登录</span></router-link></div>
      <div class="form-box">
        <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          label-width="auto"
          label-position="left"
        >
         
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"  />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone_number">
            <el-input v-model="form.phone_number"  />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input  type="password" v-model="form.password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm_password">
            <el-input v-model="form.confirm_password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button color="#738490" class="register_btn" size="large" type="primary" @click="handleRegisterClick">注 册</el-button>
          </el-form-item> 
        </el-form>
        <div class='small-text'><el-icon><ArrowLeft /></el-icon> <router-link to="/">返回首页</router-link></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import http from '@/utils/http'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import {ArrowLeft} from '@element-plus/icons-vue'
const router = useRouter()
const ruleFormRef = ref(null)
const form = ref({
  username:'',
  phone_number:"",
  password:'',
  confirm_password:''
})

// ---自定义校验规则: 确认密码---
const confirm_psw = (rule, value, callback) => {
  if (value === form.value.password) {
    callback()
  }
  else {
    callback(new Error('请再次确认密码！'))
  }
}
// ---自定义校验规则:手机号---
const phone_number = (rule, value, callback)=>{
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
// ---规则---
const rules = {
  username: [{ required: true, message:'用户名不能为空', trigger: 'blur' },
            { validator: noSpaceValidator, trigger: 'blur' }],
  phone_number:[{required: true, validator: phone_number, trigger: 'blur'},
            { validator: noSpaceValidator, trigger: 'blur' }],
  password: [{ required: true, message:'密码不能为空', trigger: 'blur' },
              { min:6, message:'密码需大于6位', trigger: 'blur' },
              { validator: noSpaceValidator, trigger: 'blur' }],
  confirm_password:[{ required: true, validator: confirm_psw , trigger: 'blur' }]
}

// ---点击login逻辑---
const handleRegisterClick = () =>{
  // 整体表单校验
  ruleFormRef.value.validate(async(valid) => {
    if (valid){
      // 通过 发请求
      let res = await http.registerCommit(form.value);
      if(res.code === 200){
        // 跳转首页 
        ElMessage.success('注册成功！')
        router.push('/login')
      }else{
        ElMessage.error(res.message)
      }
    } 
  })
}
 
</script>

<style scoped>
.register-container {
  height: 100vh;
  display: flex;

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
  color: #8b8e91;
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
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)); 
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) ); 
}
.right{
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  border-color: #dddae0;
  justify-content: center;
}
.form-box{
  width: 60%;
  margin: 18px;
  padding: 20px;
}
.register_btn{
  width: 100%;
  color: #fff;
}
.small-text{
  text-align: center;
  font-size: 14px;
  color: #726c6c;
}

</style>