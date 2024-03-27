// 图片相关pinia 数据
import { defineStore } from 'pinia'
import http from '@/utils/http'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export const useImageStore = defineStore('img', ()=>{

// [{'username': '小红', 'title': '自然', 'detail': '生活', 'filename': ['7807618fd9dd9473bb16ba4884b8c2fe.jpg', '73b6a49614822f3f168b551b4f4a8cb7.jpeg']},
// {'username': 'shu 属鼠', 'title': '油画', 'detail': '手绘', 'filename': ['4b3674eefa3d2ce5fa50d6357ab40810.jpg', '56689e00246cd59ef53cbfcef5376a9b.JPG']},
// {'username': 'shu 属鼠', 'title': '表情包', 'detail': '可爱手绘', 'filename': ['49b0b0cf12a41f61b8782540b7ad43af.png', '832299436dc29bfb197d0dd86929c587.png']}]

    const img_list = ref([])
    const search_user_list = ref([])

    // 获取首页数据
    const  getindexInfo = async() =>{
        const result = await http.getIndex()
        if( result.code === 200){
            if(result.data.length > 0){
                console.log("8888888888888",result.data)
                img_list.value =  result.data
                const baseUrl = http.server_host + '/media/imgs/'
                updateFilename(baseUrl); // 完善地址
            }
        }else{
            ElMessage.warning(result.message)
        }
    }
    // search搜索关键字图片功能
    const searchFilterImage = async(searchText)=>{
        const result = await http.searchImg(searchText)
        if(result.code === 200){
            img_list.value =  result.data
            const baseUrl = http.server_host + '/media/imgs/'
            updateFilename(baseUrl); // 完善地址
        }else{
            ElMessage.warning(result.message)
        }
    }
    // search搜索 相关用户功能
    const searchUser = async(name) =>{
        const result = await http.searchUsername(name)
        if(result.code === 200){
            
            const baseUrl = http.server_host + '/media/avatar/'
            // result.data： [{"avatar": "a07534.jpeg","username": "baby"},{ "avatar": null,"username": "bnjju" }]
            search_user_list.value = result.data.map( img => {
                if (img.avatar){
                    return {
                        ...img,
                        avatar: baseUrl + img.avatar
                    }
                }else{
                    return {
                        ...img
                    }
                }
            })
        }else{
            ElMessage.warning(result.message)
        }
    }


    // 修改filename
    const updateFilename = (baseUrl)=>{
        console.log("//? ?? ??? ???",img_list.value )
        if(Array.isArray(img_list.value)){
            img_list.value = img_list.value.map(img => {
                return {
                    ...img,
                    filename: img.filename.map(item => baseUrl + item )
                }
            })
        }
    }
    // delete
    const deleteImage = async(id) =>{
        const result = await http.deletePostImg(id)
        if(result.code === 200){
            ElMessage.success('删除成功！')
            getindexInfo()
        }else{
            ElMessage.error(result.message)
        }
    }
    // 修改帖子
    const updateImage = async(data) =>{
       const result = await http.updateImg(data)
       console.log('??????',result)
    }


    return {
        img_list,
        search_user_list,
        getindexInfo,
        updateFilename,
        searchFilterImage,
        searchUser,
        deleteImage,
        updateImage,
        
    }
})

