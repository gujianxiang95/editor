<template>
    <div class="drag">
        <span>
            水调歌头·黄州快哉亭赠张偓佺
        </span>
        <div ref="container" class="container" id="container"
            @drop="drop" 
            @dragover="dragover" 
            @dragenter="dragenter" 
            @dragleave="dragleave" 
        >
        </div>
        <pre ref="content" id="text" @dragstart="dragstart" class="pointer"
            draggable='true'>
落日绣帘卷，亭下水连空。知君为我新作，窗户湿青红。长记平山堂上，欹枕江南烟雨，杳杳没孤鸿。认得醉翁语，山色有无中。
一千顷，都镜净，倒碧峰。忽然浪起，掀舞一叶白头翁。堪笑兰台公子，未解庄生天籁，刚道有雌雄。一点浩然气，千里快哉风。
        </pre>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
    name: 'drag',
    setup(props, context) {
        const container = ref<HTMLElement | null>(null)
        const content = ref<HTMLElement | null>(null)
        const dragover = (e: Event)=>{
            e.preventDefault()
        }
        const dragstart = (e: DragEvent)=>{
            const target =  e.target as HTMLElement
            e.dataTransfer!.setData('container', target.id)
        }
        const dragenter = (e: Event)=>{
            e.preventDefault()
        }
        const dragleave = (e: Event)=>{
            e.preventDefault()
        }
        const drop = (e: DragEvent) => {
            const id = e.dataTransfer!.getData('container')
            const target =  e.target as HTMLElement
            target.appendChild(document.getElementById(id) as Node)
            // target!.appendChild(document.getElementById(id))
        }
        return {
            container,
            content,
            drop,
            dragleave,
            dragstart,
            dragover,
            dragenter,
        }
    },
})
</script>

<style lang="scss" scoped>
.container{
    width: 500px;
    height: 400px;
    margin: 0 auto;
    border: 1px solid blue;
}
</style>