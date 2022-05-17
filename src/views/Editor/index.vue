<template>
  <div id="editor-container">
    <a-layout-sider class="left">
      <!-- 组建列表 -->
      <components-list :list="defaultTextTemplates" @onItemClick="addItem"></components-list>
    </a-layout-sider>
    <a-layout>
      <!-- <p>画布区域</p> -->
      <div class="preview-list" id="canvas-area">
        <l-text v-for="component in components"
          :key="component.id"
          :is="component.name"
          v-bind="component.props"></l-text>
        <!-- <component v-for="component in components"
          :key="component.id"
          :is="component.name"
          v-bind="component.props"
        ></component> -->
      </div>
      <div class="inline-block"></div>
    </a-layout>
    <a-layout-sider class="right">
      组件属性
    </a-layout-sider>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { RootProps } from "@/store/index"
import LText from "@/components/editor/LText.vue"
import ComponentsList from '@/components/editor/ComponentsList.vue'
// 假数据 
import { defaultTextTemplates } from '@/mock/defaultTemplates'
import { TextComponentProps } from '@/store/defaultProps'
// import { useRoute } from 'vue-router'
// import { useStore } from 'vuex'
export default defineComponent({
    name: 'Editor',
    components: {
      LText,
      ComponentsList
    },
    setup() {
       const store = useStore<RootProps>()
       const components = computed(()=>store.state.EditorState.components)

       const addItem = (props: Partial<TextComponentProps>)=> {
         store.commit('addComponent', props)
       }
       return {
         components,
         addItem,
         defaultTextTemplates
       }
    },
})
</script>


<style lang="scss" scoped>
#editor-container {
  display: flex;
  .left, .right{
    width: 300px;
    background: #fff;
  }
  .preview-list {
    position: relative;
  }
}
</style>
