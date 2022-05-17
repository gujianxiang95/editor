import { createStore } from 'vuex'
import GlobalState, { GlobalProps } from './global'
import EditorState, { EditProps } from './editor'

export interface RootProps { // 全局信息
  GlobalState: GlobalProps;
  EditorState: EditProps
}
// <> 传入的值
export default createStore<RootProps>({
  modules: {
    EditorState,
    GlobalState
  }
})
