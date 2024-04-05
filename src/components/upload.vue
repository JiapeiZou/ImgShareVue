
<template>
    <div class="upload_cantainer">
        <h4 class='title'>Upload your media</h4>
        <span class='text'>
            Join our community of creators and showcase your talent by uploading your media!
        </span>
        <div>
            <el-form
                ref="ruleFormRef"
                style="width: 600px"
                :model="imageForm"
                status-icon
                :rules="rules"
                label-width="auto"
                class="demo-ruleForm"
                label-position="left"
            >
                <el-form-item label="上传图片" prop="images">
                    <el-upload
                        v-model:file-list="imageForm.filenames"
                        name="image"
                        :limit="6"
                        :action="http.server_host + '/api/upload/image'"
                        :headers="{'Authorization': 'Bearer ' + userStore.userInfo.token}"
                        list-type="picture-card"
                        :on-preview="handledialog"
                        :on-remove="handleRemove"
                        accept=".jpg,.jpeg,.png,"
                        :before-upload="beforeAvatarUpload"
                        :on-success="imageUploadSuccess"
                    >
                        <el-icon><Plus /></el-icon>
                    </el-upload>
                    <el-dialog v-model="dialogVisible">
                        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%; height:100%;" />
                    </el-dialog>

                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input
                        v-model="imageForm.title"
                        maxlength="20"
                        placeholder="请输入标题"
                        show-word-limit
                        type="text"
                    />
                    <div style="margin: 20px 0" />
                </el-form-item>
                <el-form-item label="描述" prop="detail">
                     <el-input
                        v-model="imageForm.detail"
                        maxlength="200"
                        placeholder="请输入描述"
                        show-word-limit
                        type="textarea"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleUploadClick" style="margin: 0 auto;" type='primary'>提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import http from '@/utils/http'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { ElMessage } from 'element-plus'

const router = useRouter()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const ruleFormRef = ref(null)
const uploadedImages = ref([]);
const userStore = useUserStore()
const imageForm = ref({
    title: '',
    detail: '',
    filenames: []
})
// ---自定义上传图片校验---
const validateImages = (rule, value, callback)=>{
    if (uploadedImages.value.length === 0) {
        callback(new Error('请传入图片！'));
    } else {
        callback();
    }
}
const validateTitle = (rule, value, callback) => {
      // 去除空格后验证长度
    if (value.trim().length < 1 ) {
        callback(new Error('长度必须大于1字！'));
    } else {
        callback();
    }
}
// ---form表单校验规则--- 
const rules = ref({
    title:[{required: true, message:'请设置图片标题！', trigger: 'blur'},
           { validator: validateTitle, trigger: 'blur' }
    ],
    detail:[{ validator: validateTitle, trigger: 'blur' },
            {required: true, message:'请设置图片描述！', trigger: 'blur'}
    ],
    images: [{ required: true, validator: validateImages, trigger: 'change' }]
})
// -----图片上传 成功之后----
const imageUploadSuccess = (response) =>{
    if(response.code === 200){
        uploadedImages.value.push(response.data.filename)
    }
}
//---点击照片墙 打开dialog，放大图片---
const handledialog =(file)=>{
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
//--点击照片墙 删除图片
const handleRemove =(file, fileList)=>{
    console.log(file, fileList)
    if(file.status === 'success'){
        ElMessage.success("图片删除成功！")
    }
}
//--上传图片之前 的约束: 图片文件大小、格式类型
const beforeAvatarUpload = (rawFile)=>{
    if(rawFile.type=='image/png' || rawFile.type=='image/jpg' ||rawFile.type=='image/jpeg'){
        if(rawFile.size/1024/1024 < 6){
            return true
        }else{
            ElMessage.error('上传的文件大小小于6M!')
            return false
        }
    }else{
        ElMessage.error('上传的文件格式不正确！')
        return false
    }
}
// ----form表单提交按钮
const handleUploadClick = ()=>{
    ruleFormRef.value.validate(async(valid)=>{
        // 表单校验成功
        if(valid){
            // 数据数据
            let to_submit = {
                title: imageForm.value.title,
                detail: imageForm.value.detail,
                filenames: imageForm.value.filenames.map(i => i.response.data.filename)
            };
            // 发上传图片请求
            const result = await http.uploadimages(to_submit)
            if (result.code === 200){
                ElMessage.success('上传图片成功！')
                router.push('/')
            }else{
                ElMessage.error('上传图片失败！')
            }
        // 表单校验失败
        }else{
            return false;
        }
    })
}
</script>

<style scoped>
.upload_cantainer{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap:40px;
}
.title{
    font-family: Open Sans, system-ui;
    font-size: 32px;
    margin-top: 40px;
    font-weight: 800;
}
.text{
    color: #656f79;
    font-size: 14px;
    font-weight: 400;
}
.avatar-uploader .avatar {
  width: 460px;
  height: 460px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 460px;
  height: 460px;
  text-align: center;
}
 /* <el-upload
                        name="image"
                        :headers="{'Authorization': 'Bearer ' + userStore.userInfo.token}"
                        :action="http.server_host + '/upload/image'"
                        :show-file-list="true"
                        :multiple="true"
                        class="avatar-uploader"

                        :on-preview="handlelook"
                        :on-remove="handleRemove"
                        

                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="imageForm.images" :src="imageForm.images" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload> */
</style>

