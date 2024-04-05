<template>
    <div class="container">
        <LayoutFixed :isFix="isFix" />
        <div class="search-result">
            <h3 class="search-text">{{params}}</h3>
            <div class="search-img-length">
                <div class="icon"><el-icon><PictureFilled /></el-icon></div>
                <span class="img-length">图片{{img_count?img_count:0}}张</span>
            </div>
           
            <div class='line'></div>
            <Img v-if="img_list" :imgList="img_list" /> 
            <div v-else> 
                <el-empty description="未找到相关的图片，换个关键词搜索吧！" />
            </div>
        </div>
    </div>
    
    
</template>

<script setup>
import http from '@/utils/http'
import {onMounted, ref} from 'vue'
import LayoutFixed from '@/components/LayoutFixed.vue'
import Img from '@/components/img.vue'
import {PictureFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus';
import { onBeforeRouteUpdate } from 'vue-router'

const isFix = ref(true)
const route = useRoute()
const img_list = ref(null)
const params = ref()
const img_count = ref()
// 获取路径参数
params.value = route.params.keyword

// search搜索关键字图片功能
const searchFilterImage = async(keyword = params.value) => {
    img_list.value = null
    const result = await http.searchImg(keyword)
    if(result.code === 200){
        img_list.value = result.data  // 传递给子组件
        img_count.value = img_list.value.length
    }else{
        ElMessage.warning(result.message)
        img_count.value = 0
    }
}
// 解决路由缓存
onBeforeRouteUpdate((to)=>{
    // to 想去的路径
    params.value = to.params.keyword
    searchFilterImage(to.params.keyword)
})

onMounted(()=>{
    searchFilterImage()
})

</script>

<style scoped>
.container{
    width: 100%;
}
.search-result{
    margin: 100px 80px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}
.search-text{
    font-size: 30px;
    margin-bottom: 0px;
}
.search-img-length{
    display: flex;
    color: #a8a7a7;
}
.icon{
    margin: auto 0;
    margin-top: 6px;
}
.img-length{
    margin-left: 10px;
    line-height: 2;
}
.line{
    border-bottom: 1px solid #a9a7a7;
}
</style>