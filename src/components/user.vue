<template>
    <LayoutFixed />
    <div class="user_conatiner">
        <div class="top">
            <div class="greet"><a href="/"><el-icon style="color:#fff;"><HomeFilled /></el-icon></a></div>
        </div>
        <div class='user-avatar'><img class="avatar-img" :src="userStore.userInfo.user.avatar" alt=""></div>
        <div class="bottom">
            <div class="user-">{{userStore.userInfo.user.username}} </div>
            <div class="user-info"><el-icon><UserFilled /></el-icon> {{moment(user_detail.user_join_time).format('YYYY.MM.DD')}}</div>
            <div class="user-info"><el-icon><CameraFilled /></el-icon>专辑 {{user_detail.user_img_list.length}}</div>
            <div class="img-container">
                <div v-for="img in user_detail.user_img_list" :key="img.id" class="image-wrapper">
                    <el-card  shadow="hover">
                        <img :src="img.filename[0]" alt="" class="img" style="width: 100%; height: auto;">
                        <div class="img_detail">标题：{{img.title}}</div>
                        <div class="img_detail">描述：{{img.detail}}</div>
                        <div class="img_detail"><el-icon style="margin-top:2px;"><Picture /></el-icon>：{{img.filename.length}}张</div>
                        <div class="img_btn" style="text-align: right;">
                            <el-button type="primary"  circle size="small" @click="handleEditImg(img)"><el-icon><Edit /></el-icon></el-button>
                            
                            <el-popconfirm title="你确定删除当前图片吗?" placement="top-start"  @confirm="handleDelete(img)">
                                        <template #reference>
                                            <el-button type="danger" circle  size="small"><el-icon><Delete /></el-icon></el-button>
                                        </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                </div>
            </div>
            
            <!-- el-dialog -->
             <el-dialog v-model="dialogFormVisible" title="编辑图片" width="500">
                <el-form 
                    :model="form"
                    ref="ruleFormRef"
                    :rules="rules"
                    >
                    <el-form-item label="标题" prop="title" label-width="60px">
                        <el-input  v-model="form.title" maxlength="10"  />
                    </el-form-item>
                    <el-form-item label="描述" prop="detail" label-width="60px">
                        <el-input  v-model="form.detail" maxlength="200" type="textarea" />
                    </el-form-item>
                    <el-form-item label="图片" label-width="60px">
                        <ul class="img-ul">
                            <li v-for="(imgitem, index) in form.imgs" :key="index" class='img-li'>
                                <img :src="imgitem" alt="" class="img-item">
                                <div class="overlay"> 
                                    <el-icon color="#fff" size="20px" style="margin-right:20px;" @click="imgView(imgitem)" ><ZoomIn /></el-icon>
                                    <el-popconfirm title="你确定删除当前图片吗?" placement="right" @confirm="imgDelete(index)">
                                        <template #reference>
                                            <el-icon color="#fff" size="20px"><Delete/></el-icon>
                                        </template>
                                    </el-popconfirm>
                                    <!-- <el-icon color="#fff" size="20px" @click="imgDelete(index)"><Delete/></el-icon> -->
                                </div> 
                            </li>
                        </ul>
                        <el-dialog v-model="largeSizeImg">
                            <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%; height:100%;" />
                        </el-dialog>
                       

                    </el-form-item>
                </el-form>

                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
                        <el-button type="primary" @click="editImgForm"> 确定 </el-button>
                    </div>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script setup>
import { HomeFilled, Picture, UserFilled, CameraFilled, Delete, ZoomIn, Edit} from '@element-plus/icons-vue'
import LayoutFixed from '@/components/LayoutFixed.vue'
import { useUserStore } from "@/stores/user"
import { useImageStore } from "@/stores/images"
import { ElMessage } from 'element-plus'
import {onMounted, ref } from 'vue'
import moment from "moment"  // 格式化时间
import http from '@/utils/http'

const ruleFormRef = ref(null)
const dialogFormVisible = ref(false)
const largeSizeImg = ref(false)
const dialogImageUrl = ref('')
const userStore = useUserStore()
const userImgStore = useImageStore()
const user_detail = ref()
const baseUrl = http.server_host + '/media/imgs/'
const avatar_baseUrl = http.server_host + '/media/avatar/'
user_detail.value = {
    username: "",
    avatar:"",
    image_count: 0,
    user_join_time:"",
    user_img_list:[]
}
const form = ref({
    post_id:'',
    title: "",
    detail: "",
    imgs: []
})

// ---获取用户详情页 数据---
const userImageList = async(user_id)=>{
   const result = await  http.getUserImage(user_id)
   if (result.code === 200) {
    user_detail.value = result.data
    // 格式化头像  
    user_detail.value.avatar = avatar_baseUrl + user_detail.value.avatar
    // 格式化图片地址
    user_detail.value.user_img_list = user_detail.value.user_img_list.map(img => {
        return {
            ...img,
            filename: img.filename.map(item => baseUrl + item )
        }
    })
    console.log("------test-----", user_detail.value.user_img_list)
   }
} 
// ---编辑图片 click---
const handleEditImg = (img)=>{
    dialogFormVisible.value = true
    form.value.title = img.title
    form.value.detail = img.detail
    form.value.imgs = img.filename
    form.value.post_id = img.id
}
// ---删除帖子 click---
const handleDelete = async(img)=>{
    // 调接口 删除请求
    await userImgStore.deleteImage(img.id)
    // 重新获取数据， 刷新页面
    userImageList(userStore.userInfo.user.id)
}
//---icon图标 打开dialog，放大图片---
const imgView = (file)=>{
    dialogImageUrl.value = file
    largeSizeImg.value = true
}
//---icon图标 删除图片---
const imgDelete = (idx) => {
    if (form.value.imgs.length == 1) {
        ElMessage.error("至少保留一张图片")
    } else {
        form.value.imgs.splice(idx,1)
     }
}
// ---form表单规则---
const rules = {
    title:[{required: true, message:'标题不能为空', trigger: 'blur'}],
    detail: [{required: true, message:'描述不能为空', trigger: 'blur'}]
}
// ---提交表单---
const editImgForm = ()=>{
    // 关闭对话框
    dialogFormVisible.value = false
    // 表单验证
    ruleFormRef.value.validate(async(valid) => {
        if (valid) {
            // 格式化图片文件名
            form.value.imgs =  form.value.imgs.map((url)=>{
                return url.substring(url.lastIndexOf('/') + 1);
            })
            // 发请求
            await userImgStore.updateImage(form.value)
            // 重新获取数据， 刷新页面
            userImageList(userStore.userInfo.user.id)
            ElMessage.success('修改图片成功')
        } else {
        // 未通过
        ElMessage.error('验证不通过！')
        }
    })

}

onMounted( () => {
    // ---发请求 获取当前用户所有图片信息---
    userImageList(userStore.userInfo.user.id)
    })

</script>


<style scoped>
.user_conatiner{
    width: 100%;
    height:auto;
    display: flex;
    flex-direction: column;
}

.top{
    padding: 20px;
    height: 240px;
    background-image: url('~@/assets/截屏2024-03-16 11.42.55.png');
    border-bottom: 1px solid #c4bebe;
    background-size: cover; /* 完全铺满容器 */
    background-repeat: no-repeat; /* 不重复 */
}
.user-avatar{
    height: 120px ;
    width: 120px;
    background-color: #fff;
    border-radius: 50%;
    margin-top: -80px;
   margin-left: 60px;
}
.avatar-img{
    height: 110px ;
    width: 110px;
    border-radius: 50%;
     margin-top: 5px;
   margin-left: 5px;
}
.user-name{
    font-size:32px;
    font-weight: 800;
    font-family: Open Sans, system-ui;
}
.bottom{
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 300px;
    margin: 10px 50px;
   
    /* background-color: rgb(228, 232, 235); */
}
.user-info{
    display: flex;
    gap: 10px;
    align-items: center;
    color: #767676;
    font-weight: 200;
}
.img-container {
    margin-top: 20px;
    column-count: 3; /* 设置列数为3 */
    column-gap: 10px; /* 设置列间距 */
}
.image-wrapper {
    break-inside: avoid; /* 防止内容跨列分割 */
    margin-bottom: 10px; /* 设置图片间距 */
    position: relative;  /* 开启定位 */
}
.img_detail{
    color: #767676;
    font-weight: 200;
}
.img-ul{
    list-style: none;
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 0;
    margin-right: 10px;
}
.img-li{
    margin-bottom: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    box-sizing: border-box;
    width: 100%;
    height: 150px;
    padding: 0 90px;
    position: relative;  /* 开启定位 */
}
.overlay{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.3s;
    background-color: rgba(0, 0, 0, 0.3); /* 灰色蒙层 */
    display: flex;
    justify-content: center;
    align-items: center;
}
.img-li:hover .overlay {
  opacity: 1;
}
.img-item{
    height: 100%;
    width: 100%;
    text-align: center;
}
</style>
