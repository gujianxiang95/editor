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
          v-show="!component.isHidden"
          v-for="component in components"
          :key="component.id"
          :id="component.id"
          :class="{active: currentElement && component.id === currentElement.id}"
        >
          <component
            :is="component.name"
            v-bind="component.props"></component>
        </edit-wrapper>
      </div>
    </a-layout>
    <a-layout-sider class="right" width="300px"> 
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="attr" tab="属性设置">
          <div v-if="currentElement && currentElement.props">
            <props-table v-if="!currentElement.isLocked" @change="handlechange" 
              :props="currentElement.props"
            ></props-table>
            <pre>
              {{ currentElement && currentElement.props }}
            </pre>
          </div>
          <div v-else>
            <a-empty>
              <template #description>
                <p>该图层被锁定，暂时无法编辑</p>
              </template>
            </a-empty>
          </div>
        </a-tab-pane>
        <a-tab-pane key="layer" tab="图层设置" force-render>
            <layer-list :selecetedId="currentElement && currentElement.id" @select="setActive" :list="components" @change="handlechange"></layer-list>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
      <!-- <component  v-if="currentElement" :is="currentElement.name" v-bind="currentElement.props"></component> -->
    </a-layout-sider>
    <!-- 对话框 -->
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { RootProps } from "@/store/index";
import { ComponentData } from "@/store/editor";

// 画布中组件
import ComponentsList from "@/components/editor/ComponentsList.vue";
import EditWrapper from "@/components/editor/EditWrapper.vue";
// 画布中需要的自定义组件
import LText from "@/components/editor/LText.vue"
import LImage from "@/components/editor/LImage.vue"

// 右侧属性设置 组件
import propsTable from '@/components/editor/PropsTable.vue'
// 右侧图层 组件
import layerList from '@/views/Editor/components/layerList.vue'

// 假数据
import { defaultTextTemplates } from "@/mock/defaultTemplates";
import { TextComponentProps } from "@/store/defaultProps";

export default defineComponent({
  name: "Editor",
  components: {
    LImage,
    LText,
    ComponentsList,
    EditWrapper,
    propsTable,
    layerList
  },
  setup(props, { emit }) {
    const activeKey = ref<string>('attr')
    const store = useStore<RootProps>();
    const components = computed(() => store.state.EditorState.components)
    // const components = computed(() => store.state.EditorState.components.filter(item=>!item.isHidden));
    const currentElement = computed<ComponentData  | null>(() => store.getters.getCurrentElement)
    // console.log('currentElement', currentElement)
    const setActive = (id: string) => {
      console.log('id', id)
      store.commit("setActive", id);
    };
    const addItem = (props: Partial<TextComponentProps>) => {
      store.commit("addComponent", props);
    };
    const handlechange = (e: any)=>{
      store.commit('updateComponent', e)
    }   
    return {
      components, // 添加的el列表
      addItem, // 添加el
      defaultTextTemplates, // 默认的属性值
      setActive, // 设置store的当前el
      currentElement, // 选中的当前el
      handlechange, // 改变值
      activeKey, // 右侧属性侧边栏值
    };
  },
});
</script>


<style lang="scss" scoped>
#editor-container {
  display: flex;
  .left,
  .right {
    width: 300px!important;
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
#cropper-img {
  display: block;
  max-width: 100%;
}
.active {
  border: 1px blue solid;
}
</style>
