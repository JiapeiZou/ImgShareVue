<template>
    <div class="search_user">
        <LayoutFixed />
        <div class="container">
            <div class='header'>
                <div class="header-text">
                    <span>PORTFOLIO</span>
                    <span>USER</span>
                    <span class="samll-text">The internet’s source for visuals.</span>
                    <span class="samll-text">Powered by creators everywhere.</span>
                </div>
                <img class="header-img" src="https://images.squarespace-cdn.com/content/v1/63cb4bc4764ff91373380b7d/b1937c38-cb5a-48f2-bf33-5e08fecf6c43/image-asset.jpeg" alt="">
            </div>
            <div class="content">
                <div class='img-list'>
                    <div v-for="url in srcList" :key="url">
                        <img :src="url" alt="" class="img">
                    </div>
                </div>
                <div class="user_count"><el-icon style="margin-right: 8px;"><UserFilled /></el-icon> <span>users {{imageStore.search_user_list.length}}</span> </div>
                <div>
                    <div class="user-list" v-if="imageStore.search_user_list.length > 0">
                        <div class="user_list_item" v-for="(usr,index ) in imageStore.search_user_list" :key="index">
                            <router-link :to="`/user/${usr.uid}`">
                                <img v-if="usr.avatar" class="user-avtar-img" :src="usr.avatar" alt="">
                                <div v-else class="user-avtar-img"></div>
                                <h3 class="user_name">{{usr.username}}</h3>
                            </router-link>
                        </div>
                    </div>
                    <div v-else>
                        <el-empty description="没有找到该用户>.<">
                            <el-button  type="primary">
                                <router-link to="/">返回首页</router-link>
                            </el-button>
                        </el-empty>
                    </div>
                    
                </div>
            </div>
           
        </div>
    </div>
</template>

<script setup>
import LayoutFixed from '@/components/LayoutFixed.vue'
import {UserFilled} from '@element-plus/icons-vue'
import {useImageStore} from "@/stores/images"
const imageStore = useImageStore()
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]
</script>

<style scoped>
.search_user{
    width: 100%;
    height: auto;
    background-color: rgb(229,224,218);
}
.container{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.header{
    position: relative;
    width: 80%;
    margin: auto;
    height: 500px;
    background: rgb(126,123, 70);
    padding: 30px;
    border-bottom: 3px solid hsla( 29.47,47.9%,23.33% ,1);
    /* background: rgb(229,224, 218);
    background:hsla( 29.47,47.9%,23.33% ,1);
    background: rgb(194,191, 203); */
   
}
.header-text{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 50px;
    position: absolute;
    color: rgb(194,191, 203);
    font-family: "Arial", "Helvetica", "Times New Roman", sans-serif;
    font-weight:400;
    font-size: 150px;
    z-index: 2;
}
.samll-text{
    color:hsla( 29.47,47.9%,23.33% ,1);
    font-size: 22px;
}
.header-img{
    z-index: 1; /* 设置图片在上层 */
    position: absolute;
    right: 40px;
    top: 80px;
    width: 330px;
    height: 400px;
    object-fit: cover; /* 按原比例平铺并裁剪多余部分 */
}
.content{
    display: flex;
    padding: 60px;
    flex-direction: column;
    gap: 30px;
}
.img-list{
    display: flex;
    justify-content:space-around ;
}
.img{
    width: 120px;
    height: 90px;
}
.user_count{
    color:hsla( 29.47,47.9%,23.33% ,1);
    border-bottom: 1px solid hsla( 29.47,47.9%,23.33% ,1);
    margin: auto;
    font-size: 20px;
    
}

.user-list {
    width: 100%;
    padding: 20px;
    margin-left: 20px;
    box-sizing: border-box;
    display: flex;
    /* 准许换行 */
    flex-wrap: wrap;  
    gap: 30px;
}

.user_list_item {
  flex: 1 0 calc(33.33% - 30px); /* 每排3个等宽 */
  max-width: calc(33.33% - 30px); /* 等宽 */
  height: 240px; /* 等高 */
  background-color: rgb(250, 251, 251);
  margin-bottom: 20px; /* 相同的间距 */

    border-radius:15px ;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 水平偏移量，垂直偏移量，模糊半径，阴影颜色 */

    display: flex;
    flex-direction: column;
    gap: 30px;
    justify-content: center;
    align-items: center;
}
.user_list_item:hover{
     box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}
.user-avtar-img{
    width: 80px;
    height: 80px;
    border-radius:50% ;
    background-color: rgb(205, 209, 209);
}
.user_name{
    margin-top: 20px;
    text-align: center;
}
</style>


