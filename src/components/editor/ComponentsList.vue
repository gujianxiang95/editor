<template>
    <div class="create-component-list">
        <div class="component-item" v-for="(item, index) in list" @click="onItemClick(item)" :key="index" >
            <l-text class="pointer" v-bind="item"></l-text>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LText from './LText.vue'
export default defineComponent({
    components: {
        LText
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
        const onItemClick = (data:any)=>{
            context.emit('on-item-click', data)
        }
        return {
            onItemClick
        }
    },
})
</script>



