<template>
    <div class="edit-wrapper" @click="onItemCLick(id)">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'edit-wrapper',
    props: {
        id: {
            type: String,
            required: true
        },
    },
    emits: ['set-active'],
    setup(props, context) {
        const onItemCLick = (id: string)=>{
            context.emit('set-active', id)
        }
        return {
            onItemCLick
        }
    },
})
</script>

<style>
.edit-wrapper:hover {
    border: 1px solid #ff0000;
}
</style>