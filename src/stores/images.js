// 图片相关pinia 数据
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import http from '@/utils/http'


export const useImageStore = defineStore('img', ()=>{
// [{'username': '小红', 'title': '自然', 'detail': '生活', 'filename': ['7807618fd9dd9473bb16ba4884b8c2fe.jpg', '73b6a49614822f3f168b551b4f4a8cb7.jpeg']},
// {'username': 'shu 属鼠', 'title': '油画', 'detail': '手绘', 'filename': ['4b3674eefa3d2ce5fa50d6357ab40810.jpg', '56689e00246cd59ef53cbfcef5376a9b.JPG']},
// {'username': 'shu 属鼠', 'title': '表情包', 'detail': '可爱手绘', 'filename': ['49b0b0cf12a41f61b8782540b7ad43af.png', '832299436dc29bfb197d0dd86929c587.png']}]

    
 // ---修改filename---
    const update_Filename = (baseUrl, img_list)=>{
        if(Array.isArray(img_list)){
            return img_list.map(img => {
                return {
                    ...img,
                    filename: img.filename.map(item => baseUrl + item )
                }
            })
        }
    }
// ---delete---
    const deleteImage = async(id) =>{
        const result = await http.deletePostImg(id)
        if(result.code === 200){
            ElMessage.success('删除成功！')
        }else{
            ElMessage.error(result.message)
        }
    }
// ---修改帖子---
    const updateImage = async(data) =>{
        await http.updateImg(data)
    }


    return {
        update_Filename,
        deleteImage,
        updateImage, 
    }
})

