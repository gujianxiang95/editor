<template>
    <div class="upload">
        <input type="file" ref="fileInput" class="none" @change="handleFileChange" name="file">
        <button type="submit" class="dragover" 
            @drop="drop"
            @dragover="dragover" 
            @dragenter="dragenter" 
            @dragleave="dragleave" 
            @click="triggerUpload">拖拽上传</button>
        <!-- <dd v-for="file in uploadedFiles" alt="图片预览" :key="file.uid">{{ file.name }}</dd> -->
        <cropper-btn :imgsrc="imgsrc" v-if="showCropperBtn" @change="handleSrcChange"></cropper-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CropperBtn from "@/views/Editor/components/cropperBtn.vue"
// import { hasArray } from '@/utils/utils'
export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    raw: File
}
export default defineComponent({
    name: 'upload',
    emits: ['success', 'change'],
    components: {
        CropperBtn
    },
    props: {
        showCropperBtn: {
            type: Boolean,
            default: false
        },
        value:{
            type: String,
            default: ''
        }
    },
    setup(props, { emit }) {
        const handleSrcChange = (src: string)=>{
            emit('change', {src})
        }
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
        const imgsrc = ref(props.value)
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
                        // console.log('e', e.target.result)
                        imgsrc.value = e.target.result as string
                        emit('success', {
                            uid: uploadedFiles.value.length + '1',
                            size: uploadFile.size,
                            name: uploadFile.name,
                            raw: uploadFile,
                            src: imgsrc.value
                        })
                        emit('change', {
                            src: imgsrc.value
                        })
                        uploadedFiles.value.push({
                            uid: uploadedFiles.value.length + '1',
                            size: uploadFile.size,
                            name: uploadFile.name,
                            raw: uploadFile
                        })
                        return imgsrc.value
                        // console.log('imgsrc.value', imgsrc)
                    }
                }
                
                // console.log(uploadFile)
            }
        }
        const drop = (e: DragEvent)=>{
            console.log('drop', e)
            e.stopPropagation();
            e.preventDefault();
            handImgFile(e.dataTransfer!.files)
        }
        const dragover = (e: Event)=>{
            // console.log('e', e)
            e.preventDefault()
        }
        const dragenter = (e: Event)=>{
            // console.log('e', e)
            e.preventDefault()
        }
        const dragleave = (e: Event)=>{
            // console.log('e', e)
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
            handleFileChange,
            handleSrcChange
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
    height: 30px;
    border: none;
    background-color: rgb(24, 144, 255);
    color: #fff;
}
</style>