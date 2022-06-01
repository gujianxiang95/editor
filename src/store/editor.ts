import { Module } from "vuex";
import { TextComponentProps } from "./defaultProps";
import { RootProps } from "./index"
export interface EditProps {
    components: ComponentData[];
    currentElement: string;  // 保存当前项目的一些信息
}
// [key: string] key任意键值对
export interface ComponentData {
    props: {
        [key: string]: any
    }
    id: string;
    name: string
}

export const testComponents: ComponentData[] = [
    { id: '1', name: 'l-text', props: { text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '' }},
    { id: '2', name: 'l-text', props: { text: 'hello2', fontSize: '10px', fontWeight: 'bold', 'lineHeight': '2', textAlign: 'left', fontFamily: '' }},
    { id: '3', name: 'l-text', props: { text: 'hello3', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com', 'lineHeight': '3', textAlign: 'left', fontFamily: '' }}
]

const EditorState: Module<EditProps, RootProps> = {
    state: {
        components: testComponents,
        currentElement: ''
    },
    getters: {
        getCurrentElement: (state)=>{
            return state.components.find(component=>{
                return component.id === state.currentElement
            })
        }
    },
    mutations: {
        // 新增 el
        addComponent(state, props: Partial<TextComponentProps>){
            const newComponent: ComponentData = {
                id: (state.components.length + 1 ) +'',
                name: 'l-text',
                props
            }
            // console.log('newComponent', newComponent)
            state.components.push(newComponent)
        },
        // 选中当前el id
        setActive(state, currentId: string){
            state.currentElement = currentId
        },
        // 更新元素
        updateComponent(state, {key, value }) {
            const updateComponent = state.components.find(item=>{
                return item.id === state.currentElement
            })
            if( updateComponent ){
                updateComponent.props[key as keyof TextComponentProps] = value
            }
        },
    }
}

export default EditorState
