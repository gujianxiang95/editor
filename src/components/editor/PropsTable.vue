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
          :is="value.component" 
          :[value.valueProp]="value.value" 
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options" :key="k"
              :value="option.value"
            >
                {{option.text}}
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TextComponentProps } from '@/store/defaultProps'
import { reduce, values } from 'lodash'
import { computed, defineComponent, PropType, ref } from 'vue'

import { mapPropsToFroms } from '@/components/editor/propsMap/index'

interface FormProps {
    component: string;
    subComponent?: string;
    extraProps?: { [k: string]: any };
    text?: string;
    options?: {
        text: string,
        value: any
    }[];
    valueProp?: string; 
    eventName?: string; // 事件名
    value?: string;
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
    emits: ['change'],
    setup (props, context) {
        const finalProps = computed(()=>{
            return reduce(props.props, (res, value, key)=>{
                // console.log('key', key)
                let newKey = key as keyof TextComponentProps
                const item  = mapPropsToFroms[newKey]
                if(item){
                    const { valueProp = 'value', 
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
                            [eventName]: (e: any)=>{context.emit('change',{key, value: afterTransform? afterTransform(e): e})}
                        }
                    }
                    res[newKey] = newItem
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
    width: 20%;
}
.prop-component {
    width: 70%
}

</style>


