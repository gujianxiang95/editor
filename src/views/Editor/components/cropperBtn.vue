<template>
  <div class="cropper-btn">
    <button
      class="cropper-btn"
      @click="showCropper"
    >
      裁剪图片
    </button>
    <a-modal
      :visible="cropperVisabilty"
      title="裁剪图片"
      cancelText="取消"
      okText="确认"
      @cancel="closeCropper"
      @ok="HandleOk"
    >
      <div class="image-cropper">
        <img
          ref="cropperImg"
          id="cropper-img"
          :src="imgsrc"
          alt=""
        />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
// croppper相关
import Cropper from "cropperjs";
interface cropProps {
  x: number;
  y: number;
  width: number;
  height: number;
}
export default defineComponent({
  name: 'cropper-btn',
  emits: ['change'],
  props: {
    imgsrc: {
      type: String,
      default: ''
    },
  },
  setup(props, { emit }) {
    let cropper: Cropper; // 裁剪工具对象
    let cropData: cropProps | null = null; // 裁剪数据

    const cropperImg = ref<HTMLImageElement | null>(null);
    // 是否展示 裁剪图片对话框
    const cropperVisabilty = ref<boolean>(false);
    watch(cropperVisabilty, async (newVal) => {
      if (newVal) {
        await nextTick();
        // this.$next
        if (cropperImg.value) {
          cropper = new Cropper(cropperImg.value, {
            aspectRatio: 16 / 9,
            crop(event) {
              const { x, y, width, height } = event.detail;
              cropData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height),
              };
              // console.log(event.detail.x); // 裁剪起始坐标
              // console.log(event.detail.y);
              // console.log(event.detail.width); // 图片宽高
              // console.log(event.detail.height);
              // console.log(event.detail.rotate); // 图片旋转
              // console.log(event.detail.scaleX); // 图片缩放
              // console.log(event.detail.scaleY);
            },
          });
        } else {
          if (cropper) {
            cropper.destroy();
          }
        }
      }
    });

    const HandleOk = ()=>{
      // 阿里云oss裁剪方式
      if(cropData){
        // const { x, y, width, height } =  cropData
        // 1、图片地址 + 固定字符串 + 操作方式
        // 此处图片地址应是 props传来的，这边没有阿里云oss，暂且意思下啦
        // const cropperURL = 'http://htwuhan.oss-cn-beijing.aliyuncs.com/075f4fdbf8164f5bbbd918cc6b2c097b.jpg' + '?' +'x-oss-process=image/' +  `crop,x_${x},y_${y},w_${width},h_${height}`
        // emit('change', cropperURL)
      }
      // 2、
      const cropperURL = cropper.getCroppedCanvas().toDataURL()
      emit('change', cropperURL)
      cropper.getCroppedCanvas().toBlob(blob=>{
        if(blob){
          // 发送
        }
      })
      cropperVisabilty.value = false
    }
    const closeCropper = ()=>{
      cropperVisabilty.value = false
      // Specify a different type  
    }
    const showCropper = ()=>{
      cropperVisabilty.value = true
      // Specify a different type  
    }
    return {
      // imgsrc,
      HandleOk,
      cropperImg,
      cropperVisabilty,
      showCropper, // 裁剪图片
      closeCropper //
    };
    
  },
});
</script>


<style>

</style>