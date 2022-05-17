import { RootProps } from './index'
import { Module } from "vuex";
export interface UserProps { // 用户登陆信息
  isLogin: boolean;
  userName?: string;
  img?: string;
}
export interface MasterProps { // 网站管理员信息
  masterName?: string;
  img?: string;
}
export interface GlobalProps { // 全局信息
  userInfo?: UserProps;
  masterInfo: MasterProps
}

const masterInfo: MasterProps = {
    masterName: 'gu',
    img: 'https://pic2.zhimg.com/v2-84885406204db65951ee1ecb85fe1bef_xll.jpg?source=32738c0c'
}
// <s, r> 传入的值 r供mutation、actions使用
const GlobalState: Module<GlobalProps, RootProps> = {
  state: {
    masterInfo: masterInfo
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
}
export default GlobalState
