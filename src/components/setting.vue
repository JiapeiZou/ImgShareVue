<template>
    <div class='setting-container'>
        <el-form
            ref="ruleFormRef"
            :model="form"
            :rules="rules"
            label-width="auto"
            style="max-width: 600px"
            class="setting-form"
            label-position="left"
            size="large"
        >
            <el-form-item  label="手机号码">
                <el-input disabled :placeholder="userStore.userInfo?.user.phone_number" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input  v-model= "form.username" />
            </el-form-item>
            <el-form-item label="头像">
                <!-- 上传图片  -->
                <!-- 注意！name = "image"与后端form验证的字段保持一致 -->
                <!-- headers 需携带请求头token 。element帮你发送的请求是没有请求头的， -->
                <!-- action 请求的地址， 上传图片时会请求一次，表单提交时会请求一次，两次的请求是不同的地址。 -->
                <!-- on-success 上传图片成功之后 获取code码， 后端返回的图片数据 -->
                <!-- before-upload 上传图片之前的约束， 图片文件大小、格式类型 -->
                <el-upload
                    name="image"
                    class="avatar-uploader"
                    :headers="{'Authorization': 'Bearer ' + userStore.userInfo.token}"
                    :action="http.server_host + '/api/avatar/upload'"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="form.avatar" :src="form.avatar" class="avatar" title="点击修改头像" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    <template #tip>
                        <div class="el-upload__tip">
                            jpg/png files with a size less than 400kb
                        </div>
                        </template>
                </el-upload>

            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="updateUseInfo" class='form-btn'>提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from "@/stores/user"
import { ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'

const ruleFormRef = ref(null)
const newAvatar = ref(null)
const old_avatar = ref()
const userStore = useUserStore()
const form = ref({
    username : userStore.userInfo.user.username,
    avatar : userStore.userInfo.user.avatar
})
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
    username:[{ validator: noSpaceValidator, trigger: 'blur' },
            { required: true, message:'用户名不能为空', trigger: 'blur' },]
}

// 表单提交： 修改个人信息
const updateUseInfo = ()=>{
    // 前端表单校验
    ruleFormRef.value.validate(async(valid)=>{
        if(valid){
            const { username, avatar } = form.value
            
            old_avatar.value = avatar
            
            // 提交表单，发起请求
            await userStore.settingUserInfo({ username, avatar })
            // if(old_avatar === avatar){
            //     userStore.exitAvatar(newAvatar.value)  // 修改pinia中数据
            // }else{

            // }
           userStore.exitAvatar(newAvatar.value?newAvatar.value:old_avatar.value)  // 修改pinia中数据
            ElMessage.success('修改成功！')
        }else{
            // 未通过
            ElMessage.error('验证不通过！')
        }
    })
}
//---上传图片 成功之后
const handleAvatarSuccess = (response)=>{
    if(response.code === 200){
        newAvatar.value = http.server_host + '/media/avatar/' + response.data.filename
        form.value.avatar = newAvatar.value 
    }
}
//--上传图片之前 的约束: 图片文件大小、格式类型
const beforeAvatarUpload = (rawFile)=>{
    if(rawFile.type=='image/png' || rawFile.type=='image/jpg' ||rawFile.type=='image/jpeg'){
        if(rawFile.size/1024/1024 < 4){
            return true
        }else{
            ElMessage.error('上传的文件大小小于4M!')
            return false
        }
    }else{
        ElMessage.error('上传的文件格式不正确！')
        return false
    }
}
</script>

<style scoped>
.setting-container{
    width: 70%;
    margin: auto;
}
.setting-form{
    margin: auto;
}
.form-btn{
    margin: 0 auto;
}
#set_avatar{
    width: 200px;
    height: 200px;
}
.avatar-uploader .avatar {
  width: 200px;
  height: 200px;
  display: block;
}
</style>