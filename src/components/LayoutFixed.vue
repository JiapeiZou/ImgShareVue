<template>
<!-- 吸顶导航栏 -->
    <div class="menu-container" :class="{ show: isFix||y>68}">
        <div class="left">
            <div>
                <router-link to="/">
                    <img class="logo-img" src="@/assets/logo.png" alt="">
                    <!-- <el-icon class="home-icon" size="30"><HomeFilled /></el-icon> -->
                </router-link>
            </div>
            <div class="search_input">
                <el-input
                    v-model="searchText"
                    type="search"
                    autocomplete="off"
                    style="width:600px;"
                    size="large"
                    placeholder="搜索高清图片"
                    :prefix-icon="Search"
                    @keyup.enter="handleSearch"
                />
            </div>
        </div>
        
        <div class="right">
            <div v-if="userStore.userInfo.token">
                <router-link to="/user">
                    <img :src="userStore.userInfo.user.avatar" alt="" class="avtar">
                </router-link>
            </div>
            <div v-else class="login"><router-link to="/register">登陆</router-link></div>
            <div class="upload-btn">
                <el-button @click="handleUploadImg" type="info" size="large" :icon="Plus" round>上传</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import {Search, Plus} from '@element-plus/icons-vue'
import { useScroll } from '@vueuse/core'  // vueuse插件 useScroll方法 监测滚动距离
import { ElMessage } from 'element-plus'
import { defineProps } from 'vue';

// 接收父组件传递过来的参数
defineProps({
  isFix: Boolean
});

const { y } = useScroll(window)
const userStore = useUserStore()
const router = useRouter()
const searchText = ref('')

// 搜索图片功能
const handleSearch = async()=>{
    // 发请求 获取相应数据
    const trimmedSearchText = searchText.value.trim()
    if(trimmedSearchText){
        // 跳转到搜索页面 
        router.push(`/search/img/${trimmedSearchText}`)
    }else{
        ElMessage.error('请输入有效的搜索内容！');
    }
}
// ---upload上传图片---
const handleUploadImg= ()=>{
  // 未登陆
  if(!userStore.userInfo.token){
    ElMessage.warning('请先登陆！')
  }else{
    router.push('/upload')
  }
}

</script>

<style scoped>
/* 吸顶导航栏 */
.menu-container{
    width: 100%;
    height: 68px;
    background-color: rgb(249, 249, 247);
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    gap: 10px;
    justify-content:space-between;
    border-bottom: 1px solid #e4e4e4;

    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    /* 状态1 */
    /* 样式关键 向上平移自己的高度并隐藏 */
    transform:translateY(-100%);
    opacity: 0;
}
.menu-container.show{
    transition: all 0.3s linear;
    transform:none;
    opacity: 1;
}
.home-icon{
    margin: 6px 20px 0 40px;
}
.logo-img{
    width:auto;
    height: 40px;
    margin: 0 30px;
}
.search-input{
    height: 40px;
}
.login{
    font-family: Open Sans, system-ui;
    font-size: 18px;
    width: 60px; 
    margin: auto;
}
.avtar{
    height: 40px;
    width: 40px;  
    border-radius: 50%;
}
.upload-btn{
    width: 80px; 
    margin-right: 30px;
}
.left{
display: flex;
}
.right{
display: flex;
gap: 30px;
margin-right: 30px;
}

</style>