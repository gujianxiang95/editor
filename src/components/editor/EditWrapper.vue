<template>
    <div class="edit-wrapper" @click="onItemCLick(id)"
        :style="styles"
        ref="editWrapper"
        @mousedown="startMove"
    >
        <slot></slot>
        <div class="resizers">
            <div class="resizer top-left" @mousedown.stop="startResize($event, 'top-left')"></div>
            <div class="resizer top-right" @mousedown.stop="startResize($event, 'top-right')"></div>
            <div class="resizer bottom-left" @mousedown.stop="startResize($event, 'bottom-left')"></div>
            <div class="resizer bottom-right" @mousedown.stop="startResize($event, 'bottom-right')"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { pick } from 'lodash'
interface OriginalPositions {
    left: number;
    right: number;
    top: number;
    bottom: number
}
type ResizeDescription = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
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
    emits: ['set-active', 'upadte-position', 'upadte-size'],
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
        let isMoving = false // 是否在移动
                // 计算拖动后的宽高
        const caculateSize = (description: ResizeDescription, e: MouseEvent, position: OriginalPositions) => {
            const { clientX, clientY } = e
            const {left, right, top, bottom} = position
            const container = document.getElementById('canvas-area') as HTMLElement
            const rightWidth = clientX - left
            const leftWidth = right - clientX
            const bottomHeight = clientY - top
            const topHeight = bottom - clientY
            const topOffset = clientY - container.offsetTop + container.scrollTop
            const leftOffset = clientX - container.offsetLeft
            if(description === 'top-left'){
                return {
                    width: leftWidth,
                    height: topHeight,
                    left: leftOffset,
                    top: topOffset
                }
            }
            if(description === 'top-right'){
                return {
                    width: rightWidth,
                    height: topHeight,
                    top: topOffset
                }
            }
            if(description === 'bottom-left'){
                return {
                    width: leftWidth,
                    height: bottomHeight,
                    left: leftOffset
                }
            }
            if(description === 'bottom-right'){
                return {
                    width: rightWidth,
                    height: bottomHeight
                }
            }
        }
        // 计算尺寸
        const startResize = (e: MouseEvent, description: ResizeDescription)=>{
            const currentElement = editWrapper.value
            const { left, right, top, bottom } = currentElement!.getBoundingClientRect()
            const handleMove = (e: MouseEvent)=>{
                const sizeInfo = caculateSize(
                    description,
                    e,
                    {left, right, top, bottom},
                )
                if( currentElement ){
                    // 元素左右距离
                    // const { left, top } = currentElement.getBoundingClientRect()
                    currentElement.style.width = `${sizeInfo!.width}px`
                    currentElement.style.height = `${sizeInfo!.height}px`
                    if(sizeInfo!.top){
                        currentElement.style.top = `${sizeInfo!.top}px`
                    }
                    if(sizeInfo!.left){
                        currentElement.style.left = `${sizeInfo!.left}px`
                    }
                    
                }
            }
            const handleMouseup = (e: MouseEvent)=>{
                const sizeInfo = caculateSize(
                    description,
                    e,
                    {left, right, top, bottom},
                )
                emit('upadte-position', {
                left: `${(sizeInfo!.left as number) | left}px`, 
                top: `${(sizeInfo!.top as number) | top}px`, 
                id: props.id})
                document.removeEventListener('mousemove', handleMove)
                emit('upadte-size', {
                width: `${sizeInfo!.width as number}px`, 
                height: `${sizeInfo!.height as number}px`, 
                id: props.id})
                document.removeEventListener('mousemove', handleMove)
            }
            document.addEventListener('mousemove', handleMove)
            document.addEventListener('mouseup', handleMouseup)
        }
        // 计算移动距离
        const caculateMovePosition = (e: MouseEvent)=>{
            const container = document.getElementById('canvas-area') as HTMLElement
            const left = e.clientX - gap.x - container.offsetLeft
            const top = e.clientY - gap.y - container.offsetTop + container.scrollTop
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
            // console.log(e.offsetX, e.offsetY)
            const handleMove = (e: MouseEvent)=>{
                const { left, top } = caculateMovePosition(e)
                if( currentElement ){
                    currentElement.style.top = `${top}px` 
                    currentElement.style.left = `${left}px` 
                }
                // console.log('currentElement', currentElement)
            }
            const HandleMouseUp = (e: MouseEvent)=>{
                const { left, top } = caculateMovePosition(e)
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
            startResize,
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
.edit-wrapper > .l-text-component{
    position: relative !important;
    top: 0px !important;
    left: 0px !important;
    width: 100%!important;
    height: 100%!important;
    /* position: relative;
    top: 0px ;
    left: 0px ;
    width: 100%;
    height: 100%; */
}
.edit-wrapper .resizers {
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
}
.edit-wrapper.active .resizers {
    display: block;
    position: absolute;
}
.edit-wrapper.active .resizers .resizer {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid blue;
    position: absolute;
}
.edit-wrapper.active .resizers .resizer.top-left{
    left: -5px;
    top: -5px;
    cursor: nwse-resize;
}
.edit-wrapper.active .resizers .resizer.top-right{
    right: -5px;
    top: -5px;
    cursor: nesw-resize;
}
.edit-wrapper.active .resizers .resizer.bottom-right{
    right: -5px;
    bottom: -5px;
    cursor: nwse-resize;
}
.edit-wrapper.active .resizers .resizer.bottom-left{
    left: -5px;
    bottom: -5px;
    cursor: nesw-resize;
}
</style>