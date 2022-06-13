import { ref, Ref, onMounted, onUnmounted } from "vue";

const useClickOutside = (elementRef: Ref<null | HTMLElement>) =>{
    const isClickOutside = ref(false)
    const handler = (e: MouseEvent)=>{
        if(elementRef.value && e.target){
            // TODO 类型“EventTarget”的参数不能赋给类型“Node”的参数。
            // EventTarget可以断言成子类HTMLElement
            if(elementRef.value.contains(e.target as HTMLElement) ){
                isClickOutside.value = false
            } else {
                isClickOutside.value = true
            }
        }
    }
    onMounted(()=>{
        document.addEventListener('click', handler)
    })
    onUnmounted(()=>{
        document.removeEventListener('click', handler)
    })
    return isClickOutside
}

export default useClickOutside
