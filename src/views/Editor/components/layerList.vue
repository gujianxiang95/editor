<template>
    <ul
        class="ant-list-items ant-list-bordered"
        @dragenter="cancelBubble"
        @dragover="cancelBubble"
        @drop="onUlDrop($event)"
    >
        <!-- ul  -->
        <li class="ant-list-item"
            v-for="(item, index) in list"
            :key="item.id"
            :class="{ active: item.id === selecetedId, ghost: dragData.currentDragging === item.id  }"
            :data-index="index"
            @click="handleClick(item.id)"
            @dragstart="onDragstart($event, item.id, index)"
            @dragenter="onDragEnter($event, index)"
            @dragover="cancelBubble"
            draggable="true"
        >
            <!-- @drop="onDrop($event, index)" -->
            <a-tooltip :title="item.isHidden? '显示': '隐藏'">
                <a-button shape="circle" @click="handleChange(item.id, 'isHidden' ,!item.isHidden)">
                    <template v-slot:icon v-if="item.isHidden"> <eye-outlined /> </template>
                    <template v-slot:icon v-else> <eye-invisible-outlined /> </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :title="item.isLocked? '解锁': '锁定'">
                <a-button shape="circle" @click="handleChange(item.id, 'isLocked' ,!item.isLocked)">
                    <template v-slot:icon v-if="item.isLocked"> <unlock-outlined /> </template>
                    <template v-slot:icon v-else> <lock-outlined /> </template>
                </a-button>
            </a-tooltip>
            <inline-edit :value="item.layerName" @change="(val)=>handleChange(item.id, 'layerName' , val)"></inline-edit>
            <span>{{item.layerName}}</span>
        </li>
    </ul>
</template>

<script lang="ts">
import InlineEdit from '@/views/Editor/components/inlineEdit.vue'
import { defineComponent, PropType, reactive } from 'vue'
import { EyeInvisibleOutlined, EyeOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons-vue'
import { ComponentData } from '@/store/editor'
import { arrayMoveMutable } from 'array-move'

const getParentElement = (element: HTMLElement, className: string)=>{
    while(element) {
        if(element.classList && element.classList.contains(className) ){
            return element
        }else {
            element = element.parentNode as HTMLElement
        }
    }
}
export default defineComponent({
    name: 'layer-list',
    components: {
        EyeInvisibleOutlined,
        EyeOutlined,
        UnlockOutlined,
        LockOutlined,
        InlineEdit
    },
    props: {
        list: {
            type: Array as PropType<ComponentData[]>,
            required: true
        },
        selecetedId: { // 选中id
            type: String,
            required: true
        }
    },
    emits: ['select', 'change', 'changeList'],
    setup(props, { emit }) {
        // 被拖拽的元素信息
        const dragData = reactive({
            currentDragging: '',
            currentIndex: 0
        })
        // 选中后 变更当前元素
        const handleClick = (id: string)=>{
            emit('select', id)
        }
        // 显示 锁定变化
        const handleChange = (id: string, key: string, value: boolean)=>{
            const data = {
                id,
                key,
                value,
                isRoot: true
            }
            emit('change', data)
        }
        const onDragstart = (event: DragEvent, id: string, index: number)=>{
            dragData.currentDragging = id
            dragData.currentIndex = index
        }
     
        const cancelBubble = (event: DragEvent)=>{
            event.preventDefault()
        }
        const onDragEnter = (event: DragEvent, index: number) =>{
            // 逐次交换fromindex, toindex时使用
            if(dragData.currentIndex !== index){
                arrayMoveMutable(props.list, dragData.currentIndex ,index)
                dragData.currentIndex = index
            }
        }   
        const onUlDrop = (e: DragEvent) =>{
            // 直接交换fromindex, toindex时使用
            // const target = e.target as HTMLElement
            // let moveIndex = 0
            // const currentEle = getParentElement(e.target as HTMLElement, 'ant-list-item')
            // if( currentEle && (currentEle.dataset.index)) {
            //     moveIndex = parseInt(target.dataset.index as string)
            //     arrayMoveMutable(props.list, dragData.currentIndex ,moveIndex)
            // }
            dragData.currentDragging = ''
        }
        return {
            onDragEnter,
            onUlDrop,
            cancelBubble,
            // onDrop,
            dragData,
            onDragstart,
            handleChange,
            handleClick
        }
    }
})
</script>

<style>
.active {
    border: 1px blue solid;
}
.ant-list-item:hover {
    border: red 1px solid;
}
.ghost {
    opacity: 0.5;
}
</style>