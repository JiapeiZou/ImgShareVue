<template>
    <div>
        <div class="search-img">
            <div class="search">
                <div>
                    <div class="upload-icon">
                        <h3 class="h3-title">Upload</h3>
                        <router-link to="/upload" v-if="userStore.userInfo.token">
                            <el-icon :size="30" class="icon"><Plus /></el-icon>
                        </router-link>
                        <router-link v-else to="/login">
                            <el-icon :size="30" class="icon"><Plus /></el-icon>
                        </router-link>
                    </div>  
                </div>
                <span style="font-size: 18px;">互联网上的视觉源泉，由各地的创作者驱动</span>
                <span style="color: #8e8a8a;">用图片诠释独特的视角，分享独具匠心的创意.</span>
                <div>
                    <el-input
                        v-model="searchText"
                        type="search"
                        autocomplete="off"
                        class="search_input"
                        size="large"
                        placeholder="搜索高清图片"
                        :prefix-icon="Search"
                        @keyup.enter="searchImages"
                    />
                </div>
            </div>
            <div class="text">
                <el-icon class="Paperclip_icon" :size="35"><Paperclip /></el-icon>
                在这里，我们为您呈现世界各地最引人入胜的视觉探索，让您畅游在无尽的创意灵感之中
            </div>
            <div class="bannar">
                <el-carousel indicator-position="none">
                    <el-carousel-item v-for="(img,index) in srcList" :key="index">
                        <img :src="img" alt=""  class="banner-img">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>

        <div class="img-container">
        <div v-for="img in imageStore.img_list" :key="img.id" class="image-wrapper">
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
            <!-- 图片蒙层 -->
            <div class="overlay">  
                <div class="img_detail">
                    <img
                    :src="http.server_host + '/media/avatar/' + img.user_avatar"
                    class="avatar"
                    @click="goToUserDetail(img.user_id)"
                    />
                    <div>
                        <h3 class="img_text">{{img.username}}</h3>
                        <span class="img_text">{{img.title}}</span>
                    </div>
                </div>  
            </div>
        </div>
        
    </div>

    </div>
    
</template>

<script setup>
import http from '@/utils/http'
import { useRouter } from 'vue-router'
import { onMounted, ref} from 'vue';
import {useImageStore} from "@/stores/images"
import { useUserStore } from "@/stores/user"
import {Search, Plus, Paperclip} from '@element-plus/icons-vue'

const router = useRouter()
const imageStore = useImageStore()
const userStore = useUserStore()
const searchText = ref('')

const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

// 点击图片头像 跳转页面
const goToUserDetail = async(user_id) => {
    router.push(`/user/${user_id}`)
}
// 搜索图片功能
const searchImages = async()=>{
    if(searchText.value){
        await imageStore.searchFilterImage(searchText.value)
        searchText.value = ""
    }else{
        return
    }
}

onMounted(async () => {
    await imageStore.getindexInfo();  // 等页面加载完成后 获取数据
});




</script>

<style scoped>
.img-container {
    column-count: 3; /* 设置列数为3 */
    column-gap: 20px; /* 设置列间距 */
}
.image-wrapper {
    break-inside: avoid; /* 防止内容跨列分割 */
    margin-bottom: 20px; /* 设置图片间距 */
    position: relative;  /* 开启定位 */
}
.demo-image__preview {
    width: 100%;
    height: auto;
}
.overlay{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 5px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3); /* 灰色蒙层 */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;  /* 不透明 */
    transition: opacity 0.3s; 
    pointer-events: none; /* 穿透蒙层，触发图片上的点击事件 */
    cursor: zoom-in; /* 蒙层上悬浮时显示放大镜 */
}
/* 显示蒙层 */
.image-wrapper:hover .overlay {
  opacity: 1;
}
.avatar {
    box-sizing: border-box;
  border-radius: 50%; /* 使头像呈现圆形 */
  width: 40px;
  height: 40px;
}
.avatar:hover {
   border: 1px solid rgb(189, 79, 10);
}
.overlay .avatar {
  pointer-events: auto; /* 使蒙层上头像可以响应点击事件 */
  cursor: pointer; /* 鼠标悬停时变成小手 */
}
.img_detail{
    position: absolute;
    bottom: 14px;
    left: 18px;
    display: flex;
    gap: 12px;
    color: #fbf9f9;
    
}
/* 搜索区域 */
.search-img{
    width: 100%;
    height: 300px; /* 设置总高度 */
    margin: 40px 0 50px 0;
    display: flex;
    gap: 20px;

}
.search{
    flex: 2;
    height: 100%;
    display: flex;
    gap: 20px;
    flex-direction: column;
    justify-content: flex-end;
}
.search_input{
    width: 100%;
    height: 50px; 
}
.h3-title{
    font-size: 40px;
    font-weight: 700;
    line-height: 1.2;
}
.text{
    
    box-sizing: border-box;
    padding: 30px;
    flex: 1;
    background: #f5f5f5;
    border-radius: 16px;
    color: #767676;
    font-size: 18px;

    line-height: 1.5;
    font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
    text-indent: 2em; /* 使用 em 单位，表示两个字符的宽度 */
    font-weight: 200;
    position: relative;
}
.Paperclip_icon{
    position: absolute;
    top: -12px;
    left: 10px;
}
.bannar{
    flex: 1;
    background: #ecc8c8;
    border-radius: 16px;
    overflow: hidden;
}
.banner-img{
    width: 100%;
    height:100%;
    object-fit: cover; /* 沾满容器，可能会裁剪图片 */
}
.upload-icon{
    display: flex;
    justify-self:center;
    gap: 20px;
    background: #f5f5f5;
    border-radius: 10px;
    padding: 10px;
    width: 220px;
    color: #767676;
}
.icon{
    margin-top: 8px;
}








.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
