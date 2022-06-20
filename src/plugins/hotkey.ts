import useHotKey from "@/hooks/useHotKey";
import { useStore } from "vuex";
import { EditProps } from "@/store/editor";
import { computed } from "vue";
// TODO bug同一类型的组件会相互影响
export default function initHotKeys() {
    const store = useStore()
    const currElId = computed(()=>{
        return store.state.EditorState.currentElement
    })
    useHotKey('ctrl+c, command+c', ()=>{
        store.commit('copyCompont', currElId.value)
    })
    useHotKey('ctrl+v, command+v', ()=>{
        store.commit('pasteCopiedCompont')
    })
    useHotKey('backspace, delete', ()=>{
        store.commit('delectCompont', currElId.value)
    })
    useHotKey('esc', ()=>{
        store.commit('setActive', '')
    })
    useHotKey('esc', ()=>{
        store.commit('setActive', '')
    })
}