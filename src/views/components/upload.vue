<template>
    <div class="upload">
        <pre>
            被拖放元素dragstart 被拖放元素drag

            被拖放元素dragenter 被拖放元素dragover 被拖放元素dragleave
            
            被拖放元素dragend 被拖放元素drop

            容器dragenter 容器dragover 容器dragleave 容器drop
        </pre>
        <input type="file" ref="fileInput" class="none" @change="handleFileChange" name="file">
        <button type="submit" class="dragover" 
            @drop="drop" 
            @dragover="dragover" 
            @dragenter="dragenter" 
            @dragleave="dragleave" 
        @click="triggerUpload">拖拽上传</button>
        <dd v-for="file in uploadedFiles" alt="图片预览" :key="file.uid">{{ file.name }}</dd>
        <br>
        <img :src="imgsrc" class="preview-img" alt="">
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { hasArray } from '@/utils/utils'
export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    raw: File
}
export default defineComponent({
    name: 'upload',
    setup() {
        // 列表展示数组
        const uploadedFiles = ref<UploadFile[]>([])
        // 文件input的ref
        const fileInput = ref<HTMLInputElement | null>(null)
        // 点击上传按钮时 触发 input点击事件
        const triggerUpload = ()=>{
            if( fileInput.value ){
                fileInput.value.click()
            }
        }
        // 预览图片
        const imgsrc = ref('')
        const handleFileChange = (e: any)=>{
            const target = e.target as HTMLInputElement
            const files = target.files as FileList
            handImgFile(files)
        }
        const handImgFile = (files: FileList)=>{
            if( files ){
                const uploadFile =  files[0]
                let fileReader = new FileReader()
                fileReader.readAsDataURL(uploadFile)
                fileReader.onload = (e)=>{

                    if(e.target?.result){
                        imgsrc.value = e.target.result as string
                    }
                }
                uploadedFiles.value.push({
                    uid: uploadedFiles.value.length + '1',
                    size: uploadFile.size,
                    name: uploadFile.name,
                    raw: uploadFile
                })
                return imgsrc.value
            }
        }
        const drop = (e: DragEvent)=>{
            e.stopPropagation();
            e.preventDefault();
            handImgFile(e.dataTransfer!.files)
        }
        const dragover = (e: Event)=>{
            e.preventDefault()
        }
        const dragenter = (e: Event)=>{
            e.preventDefault()
        }
        const dragleave = (e: Event)=>{
            e.preventDefault()
        }
        return {
            dragleave,
            dragover,
            dragenter,
            drop,
            uploadedFiles,
            fileInput,
            imgsrc,
            triggerUpload,
            handleFileChange
        }
    },
})
</script>


<style lang="scss" scoped>
.preview-img {
    width: 200px;
}
.dragover {
    width: 100px;
    height: 100px;
}
.container{
    width: 200px;
    height: 200px;
    border: 1px solid red;
}
</style>