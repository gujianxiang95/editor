import { Module } from "vuex";
import { TextComponentProps, textDefaultProps, imageDefaultProps } from "./defaultProps";
import { RootProps } from "./index"
export interface EditProps {
    components: ComponentData[];
    currentElement: string;  // 保存当前项目的一些信息
    page: PageData;
}
export interface PageData {
    props: { [key: string]: any };//
    title: string 
}

// [key: string] key任意键值对
export interface ComponentData {
    props: {
        [key: string]: any
    }
    id: string;
    name: string;
    isHidden?: boolean;
    isLocked?: boolean;
    layerName?: string;
}

export const testComponents: ComponentData[] = [
    { id: '1', name: 'l-text', layerName: '楼层一', props: { ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '',width: '100px', height: '100px', left: '10px', top:'10px', position:'absolute', backgroundColor: 'grey' }},
    // { id: '2', name: 'l-text', layerName: '楼层二', props: { ...textDefaultProps, text: 'hello2', fontSize: '10px', fontWeight: 'bold', 'lineHeight': '2', textAlign: 'left', fontFamily: '' }},
    // { id: '3', name: 'l-text', layerName: '楼层三', props: { ...textDefaultProps, text: 'hello3', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com', 'lineHeight': '3', textAlign: 'left', fontFamily: '' }},
    // { id: '4', name: 'l-image', layerName: '楼层四', props: { ...imageDefaultProps, src: 'https://pic2.zhimg.com/v2-84885406204db65951ee1ecb85fe1bef_xll.jpg?source=32738c0c'}}
]
const pageDefaultProps = { backgroundColor: '#00ffd5', backgroundImage: '' }

const EditorState: Module<EditProps, RootProps> = {
    state: {
        components: testComponents,
        currentElement: '',
        page: {
            props: pageDefaultProps,
            title: 'testPage'
        }
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
        addComponent(state, component: ComponentData){
            // const newComponent: ComponentData = {
            //     id: (state.components.length + 1 ) +'',
            //     name: 'l-text',
            //     props
            // }
            state.components.push(component)
        },
        // 选中当前el id
        setActive(state, currentId: string){
            state.currentElement = currentId
        },
        // 更新元素
        updateComponent(state, {key, value, id, isRoot }) {
            const updateComponent = state.components.find(item=>{
                return item.id === ( id || state.currentElement )
            })
            if( updateComponent ){
                if(isRoot){
                    // ComponentData有布尔值时，报错，应是尚未修复不过
                    // updateComponent[key as keyof ComponentData] = value
                    (updateComponent as any)[key] = value
                }else {
                    updateComponent.props[key as keyof TextComponentProps] = value
                }
            }
        },
    }
}

export default EditorState
