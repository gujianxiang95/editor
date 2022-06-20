<template>
    <div class="create-component-list">
        <div class="component-item" v-for="(item, index) in list" @click="onItemClick(item)" :key="index" >
            <l-text class="pointer" v-bind="item"></l-text>
        </div>
        <up-loader @success="handleSuccess"></up-loader>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LText from './LText.vue'
import { ComponentData } from "@/store/editor"
import UpLoader from '@/views/Editor/components/uploader.vue'
import { useStore } from 'vuex'
import { RootProps } from '@/store'
import { imageDefaultProps } from '@/store/defaultProps'
export default defineComponent({
    components: {
        LText,
        UpLoader
    },
    props: {
        list: {
            type: Array,
            require: true
        }
    },
    emits: ['on-item-click'],
    name: 'component-list"',
    setup(props, context) {
        const store = useStore<RootProps>()
        const onItemClick = (data:any)=>{
            const newComponent: ComponentData = {
                id: `${store.state.EditorState.exitLen+1}`,
                name: 'l-text',
                props: data
            }
            context.emit('on-item-click', newComponent)
        }
        const handleSuccess = (props: { [key:string]: any})=>{
            let img = document.createElement('img')
            img.src = props.src
            img.onload=()=>{
                const newComponent: ComponentData = {
                    id: `${store.state.EditorState.exitLen+1}`,
                    name: 'l-image',
                    props: {
                        ...imageDefaultProps,
                        width: `${img.width}px`,
                        height: `${img.height}px`
                    }
                }
                newComponent.props.src = props.src
                context.emit('on-item-click', newComponent)
            }
            
            
        }
        return {
            onItemClick,
            handleSuccess
        }
    },
})
</script>

