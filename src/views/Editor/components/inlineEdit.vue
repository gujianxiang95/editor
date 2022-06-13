<template>
    <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
        <input 
            v-model="innerValue"
            v-if="isEditing"
            ref='inputRef'
            placeholder="文本不能为空" name="" id="">
            <slot v-else :text="innerValue"> 
                <span>{{innerValue}}</span>
            </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'
import useKeyPress from '@/hooks/editor/useKeyPress'
import useClickOutside from '@/hooks/editor/useClickOutside'

export default defineComponent({
    name: 'inline-edit',
    props: {
        value: {
            type: String,
            required: true
        }
    },
    emits: ['change'],
    setup(props, context) {
        const wrapper = ref<null | HTMLElement>(null)
        const innerValue = ref(props.value) // 楼层名称
        const inputRef = ref<null | HTMLElement>(null)
        const isEditing = ref(false) // 楼层名称是否可编辑
        const handleClick = ()=>{
            isEditing.value = true
        }
        let catchOldValue = ''
        watch(isEditing, async (newVal)=>{
            await nextTick()
            if(newVal && inputRef.value){
                inputRef.value.focus()
                catchOldValue = innerValue.value
            }
        })
        useKeyPress('Enter', ()=>{
            if(isEditing.value){
                isEditing.value = false
                context.emit('change', innerValue.value)
            }
        })
        useKeyPress('Escape', ()=>{ // 等于初始值
            if(isEditing.value){
                isEditing.value = false
                innerValue.value = catchOldValue
            }
        })
        const isOutSied = useClickOutside(wrapper)
        watch(isOutSied, (newValue)=>{
            if(newValue && isEditing.value){
                isEditing.value = false 
                context.emit('change', innerValue.value)
            }
            isOutSied.value = false
        })
        return {
            isOutSied,
            innerValue,
            isEditing,
            handleClick,
            wrapper,
            inputRef
        } 
    },
})
</script>

<style>

</style>