<template>
  <div class="props-table">
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="prop-item"
    >
      <span class="label" v-if="value.text">{{value.text}}</span>
      <div class="prop-component">
        <component
          :showCropperBtn='true'
          :is="value.component" 
          :[value.valueProp]="value.value" 
          v-bind="value"
          v-on="value.events"
        >
          <template v-if="value.options"> 
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options" :key="k"
              :value="option.value"
            >
            <render-vnode :vNode="option.text"></render-vnode>
                <!-- {{option.text}} -->
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TextComponentProps, ImageComponentProps } from '@/store/defaultProps'
import { reduce, values } from 'lodash'
import { computed, defineComponent, PropType, ref, VNode } from 'vue'
import UpLoader from '@/views/Editor/components/uploader.vue'
import { mapPropsToFroms, ImgMapPropsToFroms } from '@/components/editor/propsMap/index'
import RenderVnode from '@/components/RenderVnode'
interface FormProps {
    component: string;
    subComponent?: string;
    extraProps?: { [k: string]: any };
    text?: string;
    options?: {
        text: string | VNode,
        value: any
    }[];
    valueProp?: string; 
    eventName?: string; // 事件名
    value?: string;
    src?: string;
    // initalTransform?: (val: any)=>any; // 初始化参数
    events?: { [key: string]: any }; 
}

export default defineComponent({
    name: 'props-table',
    props: {
        props: {
            type: Object as PropType<TextComponentProps>
        }
    },
    components: {
      UpLoader,
      RenderVnode
    },
    emits: ['change'],
    setup (props, context) {
        const finalProps = computed(()=>{
            return reduce(props.props, (res, value, key)=>{
                let textKey = key as keyof TextComponentProps;
                let imgKey = key as keyof ImageComponentProps;
                const item  = mapPropsToFroms[textKey] || ImgMapPropsToFroms[imgKey]
                if(item){
                    const { 
                      valueProp = 'value', 
                      eventName = 'change',
                      initalTransform,
                      afterTransform
                    } = item
                    const newItem: FormProps = {
                        ...item,
                        value: initalTransform? initalTransform(value): value,
                        valueProp,
                        eventName,
                        events: {
                            [eventName]: (e: any)=>{
                              context.emit('change', {key, value: afterTransform? afterTransform(e): e})}
                        }
                    }
                    // if(){
                    //   newItem.src = 
                    // }
                    res[textKey] = newItem
                }
                return res
            }, {} as {[key: string]: FormProps})
        })
        // console.log('props', props)
        // console.log('finalProps', finalProps)
        return {
            finalProps
        }
    }
})
</script>

<style lang="scss" scoped>
.prop-item {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
}
.label {
    width: 30%;
}
.prop-component {
    width: 70%
}

</style>


