<template>
  <div id="editor-container">
    <a-layout-sider class="left">
      <!-- 组建列表 -->
      <components-list
        :list="defaultTextTemplates"
        @onItemClick="addItem"
      ></components-list>
    </a-layout-sider>
    <a-layout class="preview-container">
      <!-- <p>画布区域</p> -->
      <div class="preview-list" id="canvas-area">
        <!-- <l-text v-for="component in components"
          :key="component.id"
          :is="component.name"
          v-bind="component.props"></l-text> -->
        <edit-wrapper
          @setActive="setActive"
          v-for="component in components"
          :key="component.id"
          :id="component.id"
        >
          <component 
            :is="component.name"
            v-bind="component.props"></component>
        </edit-wrapper>
      </div>
    </a-layout>
    <a-layout-sider class="right"> 
      组件属性
      <br>
      <props-table @change="handlechange" v-if="currentElement && currentElement.props"
        :props="currentElement.props"
      ></props-table>
      <pre>
        {{ currentElement && currentElement.props }}
      </pre>
      <!-- <component  v-if="currentElement" :is="currentElement.name" v-bind="currentElement.props"></component> -->
    </a-layout-sider>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { RootProps } from "@/store/index";
import { ComponentData } from "@/store/editor";

import LText from "@/components/editor/LText.vue"
import ComponentsList from "@/components/editor/ComponentsList.vue";
import EditWrapper from "@/components/editor/EditWrapper.vue";
import propsTable from '@/components/editor/PropsTable.vue'
// 假数据
import { defaultTextTemplates } from "@/mock/defaultTemplates";
import { TextComponentProps } from "@/store/defaultProps";
// import { useRoute } from 'vue-router'
// import { useStore } from 'vuex'
export default defineComponent({
  name: "Editor",
  components: {
    LText,
    ComponentsList,
    EditWrapper,
    propsTable
  },
  setup() {
    const store = useStore<RootProps>();
    const components = computed(() => store.state.EditorState.components);
    const currentElement = computed<ComponentData  | null>(() => store.getters.getCurrentElement)
    const setActive = (id: string) => {
      store.commit("setActive", id);
    };
    const addItem = (props: Partial<TextComponentProps>) => {
      store.commit("addComponent", props);
    };
    const handlechange = (e: any)=>{
      store.commit('updateComponent', e)
    }
    return {
      components,
      addItem,
      defaultTextTemplates,
      setActive,
      currentElement,
      handlechange

    };
  },
});
</script>


<style lang="scss" scoped>
#editor-container {
  display: flex;
  .left,
  .right {
    width: 300px;
    background: #fff;
  }
  .preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 24px;
    margin: 0;
    min-height: 85vh;
  }
  .preview-list {
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    margin-top: 0px;
    min-width: 375px;
    max-height: 80vh;
    min-height: 200px;
    border: 1px solid #efefef;
    background: #fff;
  }
}
</style>
