/*
 * @Author: sanghangning 
 * @Date: 2019-12-11 10:48:41 
 * @Last Modified by: sanghangning
 * @Last Modified time: 2021-06-02 14:10:06
 */

import base from '../base'; // 导入接口域名列表
import axios from '@/plugins/local/axios'; // 导入创建的axios实例

const user = {
    // // 心跳包
    // keepAlive(params) {
    //     return axios.post(`${base.api}/keep_alive/`, params);
    // },
    // // 退出登录
    // logout(params) {
    //     return axios.post(`${base.api}/logout/`, params);
    // },
    // // 获取用户信息    
    // getUserInfo(params) {
    //     return axios.post(`${base.api}/user_info/`, params);
    // }
}

export default user;