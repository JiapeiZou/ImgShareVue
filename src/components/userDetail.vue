<template>
    <LayoutFixed />
    <div class="user_conatiner">
        <div class="top">
            <div class="greet"><a href="/"><el-icon style="color:#fff;"><HomeFilled /></el-icon></a></div>
        </div>
        <div class='user-avatar'><img class="avatar-img" :src="user_detail.avatar" alt=""></div>
        <div class="bottom">
            <div class="user-name">{{user_detail.username}}</div>
            <div class="user-info"><el-icon><UserFilled /></el-icon> {{moment(user_detail.user_join_time).format('YYYY-MM-DD')}}</div>
            <div class="user-info"><el-icon><CameraFilled /></el-icon>专辑 {{user_detail.user_img_list.length}}</div>
            <div class="img-container">
                <div v-for="img in user_detail.user_img_list" :key="img.id" class="image-wrapper">
                    <el-card  shadow="hover">
                        <el-image
                            class="demo-image__preview"
                            :src="img.filename[0]"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :preview-src-list="img.filename"
                            :initial-index="4"
                            fit="contain"
                            style="width: 100%; height: auto;"
                        />
                        <div class="img_detail">标题：{{img.title}}</div>
                        <div class="img_detail">描述：{{img.detail}}</div>
                        <div class="img_detail"><el-icon><Picture /></el-icon>： {{img.filename.length}}张</div>
                    </el-card>
                    
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup>
import {HomeFilled, CameraFilled, UserFilled, Picture} from '@element-plus/icons-vue'
import LayoutFixed from '@/components/LayoutFixed.vue'
import moment from "moment"  // 格式化时间
import http from '@/utils/http'
import {onMounted, ref} from 'vue'
import { useRoute } from 'vue-router'

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

// 获取用户详情页 数据
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
    // console.log("-----------", user_detail.value.user_img_list)
   }
} 

// {{user_detail.username}}  {{user_detail.image_count}}
onMounted( () => {
    // ---获取动态路由 参数---
    userImageList( useRoute().params.uid )
    })
</script>

<style scoped>
.user_conatiner{
    width: 100%;
    height: auto;
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
    margin: 10px 50px;
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

</style>
