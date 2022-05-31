import { TextComponentProps } from "@/store/defaultProps";
export interface ProptoFrom {
    component: string;
    subComponent?: string;
    extraProps?: { [k: string]: any };
    text?: string;
    options?: {
        text: string,
        value: any
    }[];
    valueProp?: string; 
    eventName?: string; // 事件名

    // value?: string;
    afterTransform?: (v: any) => any
    initalTransform?: (val: any)=>any; // 初始化参数
    // events?: { [key: string]: any }; 
}
export type PropToFroms = {
    [P in keyof TextComponentProps]?: ProptoFrom
}


export const mapPropsToFroms: PropToFroms = {
    text: {
        text: '文本',
        component: 'a-textarea',
        afterTransform: (e: any) => e.target.value,
    },
    fontSize: {
        text: '字号',
        component: 'a-input-number',
        initalTransform: (v: string) => parseInt(v),
        afterTransform: (e: number) => e ? `${e}px` : '',
    },
    lineHeight: {
        text: '行高',
        component: 'a-slider',
        extraProps: {
            min: 0, max: 3,
            step: 0.1
        },
        initalTransform: (v: string) => parseFloat(v),
        afterTransform: (e: number) => e.toString()
    },
    textAlign: {
        component: 'a-radio-group',
        subComponent: 'a-radio-button',
        text: '对齐',
        options: [
            { value: 'left', text: '左' },
            { value: 'center', text: '中' },
            { value: 'right', text: '右' }
        ],
    },
    fontFamily: {
        component: 'a-select',
        subComponent: 'a-select-option',
        text: '字体',
        options: [
            { text: '宋体', value: '"SimSun","STSong"' },
            { text: '黑体', value: '"SimHei","STHeiti"' },
            { text: '楷体', value: '"KaiTi","STKaiti"' },
            { text: '仿宋', value: '"FangSong","STFangsong"' },
        ]
    },
}