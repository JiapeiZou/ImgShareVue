<template>
  <div class="home">
    <LayoutFixed />
    <div class="home-container">
    <!-- ----------------------- -->
      <div class="header">
        <a href="/" class="brand">
        <img class="logo-img" src="@/assets/logo.png" alt="">
        <!-- <strong>image</strong> -->
        </a>
        <div class="header-content">
          <div class="greet"><a href="/"><el-icon><House /></el-icon></a></div>
          <div>
            <el-input
              v-model="searchText"
              type="search"
              autocomplete="off"
              class="search_input"
              size="large"
              placeholder="搜索用户名"
              style="width:400px; height:50px;"
              :prefix-icon="UserFilled"
              @keyup.enter="searchImages"
            />    
          </div> 
          <div class="signout">
            <ul class="ul-li">
              <!-- 登陆状态 -->
              <template v-if="userStore.userInfo.token">
                <li>
                  <el-dropdown @command="handleCommand">
                    <div class="el-dropdown-link">
                      <img :src="userStore.userInfo.user.avatar" alt=""  class="user_avatar" @click="handleSetting">
                      <el-icon class="el-icon--right">
                        <arrow-down />
                      </el-icon>
                    </div>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :icon="User" disabled>{{userStore.userInfo.user.username}}</el-dropdown-item>
                          <el-dropdown-item command="a">个人主页</el-dropdown-item>
                          <el-dropdown-item command="b">个人设置</el-dropdown-item>
                          <el-dropdown-item command="c" divided>退出登陆</el-dropdown-item>
                         
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                </li>      
              </template >
              <!-- 非登陆 -->
              <template v-else>
                <li><router-link to="/login">登陆</router-link></li>
                <li><router-link to="/register">注册</router-link></li>
              </template>
              <li><el-button color="rgb(189, 79, 10)" round  @click="handleUploadImg"><el-icon class="icon-style"><Plus /></el-icon> 上传</el-button></li>
            </ul>
          </div>
        </div>
      </div>
<!-- ---------------------------------- -->
      <div class='main'>
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </div>
<!-- -------------------------------- -->
      <el-footer class="footer">
        <div class="footer-img-box">
          <img class="footer-img" src="@/assets/footerimage.png" alt="">
        </div>
        <div class="footer-info">
          <h1>每张图片都有一个故事</h1>
          <span>"发现世界，分享无限可能，尽在我们的广阔图库中"</span>
          <div>
            <input type="text" placeholder="与我们分享您的想法" v-model="message" class="footer-input">
            <el-button round color="rgb(189, 79, 10)" @click="sendMessage">提交</el-button>
          </div>
        </div>
      </el-footer>
    </div>
          <!-- 未登陆的upload Dialog -->
          <el-dialog
            v-model="uploadDialogVisible"
            title="提示"
            width="500"
            align-center
          >
            <span>请先登陆，才能上传图片哦！</span>
            <div>现在就去登陆吗？</div>
              <template #footer>
              <div class="dialog-footer">
                <el-button @click="uploadDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogComfirm">
                  确定
                </el-button>
              </div>
            </template>
          </el-dialog>
      </div>
</template>



<script setup>
import LayoutFixed from '@/components/LayoutFixed.vue'
import { House, Plus, UserFilled, ArrowDown, User } from '@element-plus/icons-vue'
import { useUserStore } from "@/stores/user"
import {useImageStore} from "@/stores/images"
import { useRouter } from "vue-router"
import {ref } from 'vue'
import http from '@/utils/http'
import { ElMessage } from 'element-plus'

const imageStore = useImageStore()
const userStore = useUserStore()
const router = useRouter()
const uploadDialogVisible = ref(false)
const settingDialogVisible = ref(false)
const searchText = ref('')
const message = ref('')

// ---搜索按钮用户名 回车键事件---
const searchImages = async() =>{
  if(searchText.value){
    await imageStore.searchUser(searchText.value)
    searchText.value = "" // 清空输入框
    router.push('/search')
  }else{
    return
  }
}
//  ----下拉菜单---
const handleCommand = (command) => {
  // command代表点击的菜单中的哪一行 a=设置 b=退出
  if (command === 'b'){
    router.push('/setting')
  }
  else if(command === 'a'){
    router.push('/user')
  }else{
    // ---退出登陆逻辑---
    settingDialogVisible.value = false
    // 清空用户信息 pinia中的userInfo
    userStore.clearUserInfo()
    // 跳转页面
    router.push('/login')
  }
}

// ---upload上传图片---
const handleUploadImg= ()=>{
  // 未登陆
  if(!userStore.userInfo.token){
    uploadDialogVisible.value = true
  }else{
    router.push('/upload')
  }
}
// ---upload确定按钮---
const dialogComfirm = ()=>{
  // 跳转登陆页
  router.push('/login')
  uploadDialogVisible.value = false
}
// ---footer留言按钮---
const sendMessage = async()=>{
  // 发送请求
  if(message.value ){
    const result = await http.leaveMessage({msg : message.value })
    if(result.code === 200){
      ElMessage.success('发送成功！')
      message.value = ''
    }else{
      ElMessage.error(result.message.msg)
    }
  }else{
    return
  }
  
}

</script>

<style scoped>
.home{
  height: 100%;
}
.home-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
.header {
  padding: 0 30px;
  height: 300px;
  background-image: url('https://cdn.pixabay.com/photo/2023/09/22/07/52/beach-8268375_1280.jpg');
  display: flex;
  background-size: cover;
  background-position: center;
}
.signout{
  margin-right: 30px;
}
.main{
  background: #fff;
  margin: auto;
  padding: 10px 80px;
}
.header .brand {
  width: 200px;
  margin-left: -20px;
  font-size: 22px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header .header-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  color: #fff;
  gap:20px;
}

.header-content .signout {
    cursor: pointer;
  }
.icon-style{
  margin-right: 5px;
}
.footer {
  margin-top: 100px;
  background: #788372;
  /* background: rgb(2, 49, 32);
  background: rgb(189, 79, 10); */
  height: 300px;
  display: flex;
  align-items: center;
  gap: 50px;
  padding: 0 100px;
}
.logo-img{
  width:100px ;
  height: auto;
}
.footer-img-box{
  flex: 1;
  display: flex;
}
.footer-img{
  margin-left: 150px;
  width:260px ;
  height: 200px;
}
.footer-info{
  flex: 1;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.footer-input{
  width:200px ;
  height: 40px;
  margin-right: 20px;
  padding: 0 10px;
}
.ul-li{
  display: flex;
  gap: 20px;
}
.user_avatar{
  width:40px ;
  height: 40px;
  border-radius:50%;
}
.setting_el-dialog{
  border-radius:20px;
  background-color: rgb(1, 1, 22);
}
.dialog-item{
  margin-bottom: 10px;
  width: 100%;
  cursor: pointer; /* 鼠标悬停时显示小手指指示 */
}



</style>
<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  text-decoration: none;
  vertical-align: baseline;
}
ul {
  list-style: none;
}
li{
  text-align: center;
  margin: auto;
}
a {
  color: inherit; /* 继承父元素的颜色 */
}
</style>

<style>
html{
--el-menu-active-color:none;
}
    
</style>