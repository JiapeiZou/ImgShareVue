//   npm install axios --save | npm install qs --save
import axios from 'axios'
import qs from 'qs'   // 把post中的请求data进行转换
import { useUserStore } from '@/stores/user'


const SERVER_HOST = process.env.VUE_APP_SERVER_HOST

class Http{
    constructor(){
        this.server_host = SERVER_HOST
        this.http = axios.create({
            baseURL: SERVER_HOST + "/api",
            timeout: 1000*60,
            withCredentials:true
        })
        //  请求拦截器
        this.http.interceptors.request.use(config => {
            const userStore = useUserStore() 
            const token = userStore.userInfo.token // pinia中存储
            if(token){ // // 将token设置在请求头中 所有通过 Axios 发出的 HTTP 请求都会自动包含这个 Authorization 头部，其值为 'Bearer ' + token
                config.headers.Authorization = "Bearer " + token
            }                  
            return config
        })

        // 响应后拦截器
        this.http.interceptors.response.use(response => {
            return response.data
        })

    }
    _post(url, data){
        return this.http.post(url, qs.stringify(data))
    }
    registerCommit(data){ // 注册请求
        const  url = "/register"
        return this._post(url, data)
    }
    loginCommit(data){ // 登陆请求
        const url = '/login'
        return this._post(url, data)
    }
    settingUser(data){ // 修改个人信息
        const url = '/user/setting'
        return this._post(url, data)
    }
    uploadimages(data){  // 上传图片
        const url = '/detail/image'
        return this._post(url,data)
    }
    getIndex(){
        const url = '/home'// 首页获取数据
        return this.http.get(url)
    }
    getUserImage(user_id){ // 获取用户图片相关信息
        const url = 'user/picture/' + user_id
        return this.http.get(url)
    }
    deletePostImg(img_id){ // 删除图片专辑
        const url = '/delete/img'
        return this._post(url, {"id":img_id})
    }
    updateImg(data){ // 编辑图片专辑
        const url = "/update/img"
        return this._post(url, data)
    }
    searchImg(search_text){ // 搜索图片
        const url = "/search/img?q=" + search_text
        return this.http.get(url)
    }
    searchUsername(name){ // 搜索用户
        const url = '/search/username?username=' + name
        return this.http.get(url)
    }
    leaveMessage(msg){ // 意见留言
        console.log("----http-----", msg)
        const url = '/send/message'
        return this._post(url, msg)
    }
}

export default new Http()