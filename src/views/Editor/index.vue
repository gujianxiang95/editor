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
      <div class="preview-list" id="canvas-area" :style="page.props">
        <!-- <l-text v-for="component in components"
          :key="component.id"
          :is="component.name"
          v-bind="component.props"></l-text> -->
        <edit-wrapper
          @upadte-position="upadtePosition"
          @setActive="setActive"
          v-show="!component.isHidden"
          v-for="component in components"
          :key="component.id"
          :id="component.id"
          :props="component.props"
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
          <div v-if="currentElement && currentElement.props" >
            <!-- <props-table 
              v-if="!currentElement.isLocked" 
              @change="handlechange" 
              :props="currentElement.props"
            ></props-table> -->
            <edit-group 
              v-if="!currentElement.isLocked" 
              @change="handlechange" 
              :props="currentElement.props"
            ></edit-group>
            <pre>
              {{ currentElement && currentElement.props }}
            </pre>
          </div>
          <div v-else>
            <a-empty>
              <template #description>
                <p>该楼层被锁定，暂时无法编辑</p>
              </template>
            </a-empty>
          </div>
        </a-tab-pane>
        <a-tab-pane key="layer" tab="楼层设置" force-render>
            <layer-list @changeList="changeElList" :selecetedId="currentElement && currentElement.id" @select="setActive" :list="components" @change="handlechange"></layer-list>
        </a-tab-pane>
        <a-tab-pane key="page-setting" tab="页面设置">
          <props-table :props="page.props"></props-table>
        </a-tab-pane>
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
import EditGroup from "@/components/editor/EditGroup.vue";

// 画布中需要的自定义组件
import LText from "@/components/editor/LText.vue"
import LImage from "@/components/editor/LImage.vue"

// 右侧属性设置 组件
import propsTable from '@/components/editor/PropsTable.vue'
// 右侧楼层 组件
import layerList from '@/views/Editor/components/layerList.vue'

// 假数据
import { defaultTextTemplates } from "@/mock/defaultTemplates";
import { TextComponentProps } from "@/store/defaultProps";

// TODO
// 1、color-picker组件传值问题
// 2、添加可移动组件 将临时传递到普通组件内部的样式去除
export default defineComponent({
  name: "Editor",
  components: {
    LImage,
    LText,
    ComponentsList,
    EditWrapper,
    propsTable,
    layerList,
    EditGroup
  },
  setup(props, { emit }) {
    const activeKey = ref<string>('attr')
    const store = useStore<RootProps>();
    const components = computed(() => store.state.EditorState.components)
    const page = computed(()=> store.state.EditorState.page)
    // console.log('page',page)
    // const components = computed(() => store.state.EditorState.components.filter(item=>!item.isHidden));
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
    const changeElList = ()=>{
      console.log('123')
    }
    const upadtePosition = (data: {id: string, left:number, top: number})=>{
      const {top, left, id} = data
      store.commit('updateComponent', {
        key: 'left',
        value: `${left}px`,
        id
      })
       store.commit('updateComponent', {
        key: 'top',
        value: `${top}px`,
        id
      })
    }
    return {
      changeElList, 
      components, // 添加的el列表
      addItem, // 添加el
      defaultTextTemplates, // 默认的属性值
      setActive, // 设置store的当前el
      currentElement, // 选中的当前el
      handlechange, // 改变值
      activeKey, // 右侧属性侧边栏值
      page,
      upadtePosition // 更新移动组件
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
