import { Module } from "vuex";
import { TextComponentProps } from "./defaultProps";
import { RootProps } from "./index"
export interface EditProps {
    components: ComponentData[];
    currentElement: string;
}
// [key: string] key任意键值对
interface ComponentData {
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
    mutations: {
        addComponent(state, props: Partial<TextComponentProps>){
            const newComponent: ComponentData = {
                id: '5',
                name: 'l-text',
                props
            }
            state.components.push(newComponent)
        },
    }
}

export default EditorState
