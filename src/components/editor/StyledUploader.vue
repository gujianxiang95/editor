<template>
  <uploader class="styled-uploader"
    :showUploadList='false'
    :beforeUpload="commonUploadCheck"
    @success="(data) => {handleUploadSuccess(data.resp, data.file.raw)}"
  >
  </uploader>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
type ErrorType = 'size' | 'format' | null
interface CheckCondition {
  format?: string[];
  // 使用多少 M 为单位
  size?: number;
}
export function beforeUploadCheck (file: File, condition: CheckCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}
export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
  const { passed, error } = result
  if (error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (error === 'size') {
    message.error('上传图片大小不能超过 1Mb')
  }
  return passed
}
export default defineComponent({
    emits: ['success'],
    setup(props, {emit}) {
        const handleUploadSuccess = (resp: any, file: File) => {
            emit('success', { resp, file })
        }
        return {
            commonUploadCheck,
            handleUploadSuccess
        }
    },
})
</script>


<style>

</style>