<template>
   
        <div class="img-container">
            <div v-for="img in processedImgList" :key="img.id" class="image-wrapper">
                <el-image
                    lazy
                    class="demo-image__preview"
                    :src="img.filename[0]"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="img.filename"
                    :initial-index="4"
                    fit="contain"
                    :style="{width: img_width + 'px', height: Math.round(img_width*(img.height/img.width)) + 'px'}"   
                >
                <!-- 根据固定的宽度 计算当前图片缩放的高度  新宽度 / 原始宽高比 -->
                    <template #placeholder>
                        <img 
                            :src="'data:image/jpeg;base64,' + img.small_img" 
                            :style="{ width: img_width + 'px', height: Math.round(img_width*(img.height/img.width)) + 'px'}"
                            alt=""
                        >
                    </template>
                </el-image>
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
        
    
</template>
<script setup>
import http from '@/utils/http'
import defineProps from 'vue'
import { useRouter } from 'vue-router'
import {useImageStore} from "@/stores/images"
import { computed, ref } from 'vue';
import { useWindowSize } from '@vueuse/core' // 获取显示器宽度


const props = defineProps({ imgList: Array , image_all_count: Number})  // 接收父组件传递的参数
const baseUrl = http.server_host + '/media/imgs/'
const router = useRouter()
const imageStore = useImageStore()

// 每个图片的宽度 [ 总 - （margin 80*2 ） - （图片间隔 20*2）] / 3
const img_width = ref()
const { width } = useWindowSize()
const imageWidth = (width.value - 160 - 40) / 3
img_width.value = parseFloat(imageWidth.toFixed(2))

 // 修改filename 完善图片地址
 const processedImgList = computed(() => {
    return imageStore.update_Filename(baseUrl, props.imgList)
 })

// 跳转用户详情页面
const goToUserDetail = (user_id)=>{
    router.push(`/user/${user_id}`)
}

</script>

<style scoped>

.img-container {
    width: 100%;
    column-count: 3; /* 设置列数为3 */
    column-gap: 20px; /* 设置列间距 */
}
.image-wrapper {
    break-inside: avoid; /* 防止内容跨列分割 */
    margin-bottom: 20px; /* 设置图片间距 */
    position: relative;  /* 开启定位 */
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
    color: #fff; 
}
.img_text{
    font-size: 14px;
    font-weight: 300;
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