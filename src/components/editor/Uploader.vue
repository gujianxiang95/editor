<template>
  <div class="file-uploader">
    <div
      class="uploader-area"
      :class="{ 'is-dragover': drag && isDragOver }"
      v-on="events"
    >
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      name=""
      ref="fileInput"
      id=""
      :style="{ display: 'none' }"
      @change="handleFileChange"
    />
    <ul :class="`upload-list upload-list-${listType}`">
      <li
        :class="`uploaded-file upload-${file.status}`"
        v-for="file in filesList"
        :key="file.uid"
      >
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
        />
        <span v-if="file.status === 'loading'" class="file-icon"
          ><LoadingOutlined
        /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"
          ><DeleteOutlined
        /></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, PropType } from "vue";
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined,
} from "@ant-design/icons-vue";
import { last } from "lodash"; // 获取数组最后的元素
// import { v4 as uuidv4 } from 'uuid'

type UploadStaus = "ready" | "loading" | "success" | "error";
type FileListType = "picture" | "text";
type CheckUpload = (file: File) => boolean | Promise<File>;
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStaus;
  raw: File;
  resp?: any;
  url?: string;
}
export default defineComponent({
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
  },
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<FileListType>,
      defualt: "text",
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const fileInput = ref<null | HTMLElement>(null);
    const filesList = ref<UploadFile[]>([]);
    const isDragOver = ref(false);
    const isUploading = computed(() => { // 是否正在上传
      return filesList.value.some((file) => file.status === "loading");
    });
    const lastFileData = computed(() => { 
      const lastFile = last(filesList.value); // 获取最后上传的file是否成功上传
      if (lastFile) {
        return {
          loaded: lastFile.status === "success",
          data: lastFile.resp,
        };
      }
    });
    const removeFile = (id: string) => { 
      filesList.value = filesList.value.filter((file) => file.uid !== id);
    };
    const triggerUpload = () => { // 上传事件
      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData();
      formData.append(readyFile.name, readyFile.raw);
      readyFile.status = "loading";
      axios
        .post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          readyFile.status = "success";
          readyFile.resp = resp.data;
          emit("success", {
            resp: resp.data,
            file: readyFile,
            list: filesList.value,
          });
        })
        .catch((e: any) => {
          readyFile.status = "error";
          emit("error", { error: e, file: readyFile, list: filesList.value });
        })
        .finally(() => {
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        });
    };
    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: "ready",
        raw: uploadedFile,
      });
      if (props.listType === "picture") {
        try {
          fileObj.url = URL.createObjectURL(uploadedFile);
        } catch (err) {
          console.error("upload File error", err);
        }
        // FileReader to preview local image
        // const fileReader = new FileReader()
        // fileReader.readAsDataURL(uploadedFile)
        // fileReader.addEventListener('load', () => {
        //   fileObj.url = fileReader.result as string
        // })
      }
      filesList.value.push(fileObj);
      if (props.autoUpload) {
        postFile(fileObj);
      }
    };

    const beforeUploadCheck = (files: null | FileList) => {
      if (files) {
        const uploadedFile = files[0];
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile);
          if (result && result instanceof Promise) {
            result
              .then((processedFile) => {
                if (processedFile instanceof File) {
                  addFileToList(processedFile);
                } else {
                  throw new Error(
                    "beforeUpload Promise should return File object"
                  );
                }
              })
              .catch((e) => {
                console.error(e);
              });
          } else if (result === true) {
            addFileToList(uploadedFile);
          }
        } else {
          addFileToList(uploadedFile);
        }
      }
    };
    const uploadFiles = () => {
      filesList.value
        .filter((file) => file.status === "ready")
        .forEach((readyFile) => postFile(readyFile));
    };
    let events: { [key: string]: (e: any) => void } = {
      click: triggerUpload,
    };
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      beforeUploadCheck(target.files);
    };
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files);
      }
    };
    if (props.drag) {
      events = {
        ...events,
        dragover: (e: DragEvent) => {
          handleDrag(e, true);
        },
        dragleave: (e: DragEvent) => {
          handleDrag(e, false);
        },
        drop: handleDrop,
      };
    }
    return {
      fileInput,
      handleFileChange,
      isUploading,
      filesList,
      removeFile,
      lastFileData,
      isDragOver,
      events,
      uploadFiles,
    };
  },
});
</script>


<style>
</style>