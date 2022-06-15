<template>
    <div class="edit-wrapper" @click="onItemCLick(id)"
        :style="styles"
        ref="editWrapper"
        @mousedown="startMove"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { pick } from 'lodash'
export default defineComponent({
    name: 'edit-wrapper',
    props: {
        id: {
            type: String,
            required: true
        },
        props: {
            type: Object
        },
    },
    emits: ['set-active', 'upadte-position'],
    setup(props, {emit}) {
        const editWrapper = ref<null | HTMLElement>(null)
        // 设置选中元素
        const onItemCLick = (id: string)=>{
            emit('set-active', id)
        }
        // 偏移量
        const gap = {
            x: 0,
            y: 0
        }
        let isMoving = false
        // 计算移动距离
        const caculateMovePosition = (e: MouseEvent)=>{
            const container = document.getElementById('canvas-area') as HTMLElement
            const left = e.clientX - gap.x - container.offsetLeft
            const top = e.clientY - gap.y - container.offsetTop
            return {
                left,
                top
            }
        }
        const startMove = (e: MouseEvent)=>{
            let isMoving = true
            const currentElement = editWrapper.value
            if( currentElement ){
                gap.x = e.clientX - currentElement.getBoundingClientRect().left
                gap.y = e.clientY - currentElement.getBoundingClientRect().top
            }
            // console.log(gap)
            // console.log(e.offsetX, e.offsetY)
            const handleMove = (e: MouseEvent)=>{
                const {left, top} = caculateMovePosition(e)
             
                if( currentElement ){
                    currentElement.style.top = `${top}px` 
                    currentElement.style.left = `${left}px` 
                }
                // console.log('currentElement', currentElement)
            }
            const HandleMouseUp = (e: MouseEvent)=>{
                const {left, top} = caculateMovePosition(e)
                if( isMoving ){
                    emit('upadte-position', {left, top, id: props.id})
                    isMoving = false
                }
                document.removeEventListener('mousemove', handleMove)
                isMoving = false
            }
            document.addEventListener('mousemove', handleMove)
            document.addEventListener('mouseup', HandleMouseUp)
        }
        

        const styles = computed(()=>pick(props.props, ['position', 'left', 'top', 'width', 'height']))
        return {
            startMove,
            editWrapper,
            styles,
            onItemCLick,
            caculateMovePosition
        }
    },
})
</script>

<style lang="scss">
// TODO<style scoped>--->scoped慎用
// vue组件中的style标签标有scoped属性时表明style里的css样式只适用于当前组件元素
// 而如果你的标签是其他组件插槽进来的声明过scoped将无法对其产生作用
.edit-wrapper:hover {
    border: 1px solid #ff0000;
}
.edit-wrapper > *{
    position: relative !important;
    top: 0px !important;
    left: 0px !important;
}
</style>