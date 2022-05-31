<template>
  <div id="#app">
    <a-layout-header class="header">
      <h1 class="page-title pointer" @click="goHome">gu's demo</h1>
      <img :src="masterInfo.img" class="head-img pointer" alt="gu">
    </a-layout-header>
    <a-layout-content class="layout-content" v-if="whiteHeader">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="footer">
      联系方式: gu_jian_xiang@126.com
    </a-layout-footer>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { RootProps } from '@/store/index'
export default defineComponent({
    name: 'Editor',
    setup() {
        // # 路由相关
        const route = useRoute()
        const router = useRouter()
        // ## 路由方法
        const goHome = ()=>{
          router.push('/')
        }
        // <GlobalDataProps>泛型约束返回结果
        // const store = useStore()
        const store = useStore<RootProps>()
        // 依赖
        const masterInfo = computed(()=> store.state.GlobalState.masterInfo )
        const whiteHeader = computed(()=> route.meta.whiteHeader)
        message.success('欢迎访问👏', 2)
        return {
            // 路由相关
            goHome,
            masterInfo,
            whiteHeader
        }
    },
})
</script>

<style lang="scss" >
@import '@/assets/scss/reset.scss';
@import '@/assets/scss/common.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      display: inline-block;
    }
    .head-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #FFF;
  }
  .layout-content {
    min-height: calc(100vh - 64px);
    padding-bottom: 70px;
  }
  .page-title {
    text-align: left;
    color: #FFF;
  }
}
</style>
