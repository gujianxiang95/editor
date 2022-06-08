import { TextComponentProps, ImageComponentProps } from "@/store/defaultProps";
import { h, VNode } from "vue";
export interface ProptoFrom {
    component: string;
    subComponent?: string;
    extraProps?: { [k: string]: any };
    text?: string;
    options?: {
        text: string | VNode;
        value: any;
    }[];
    valueProp?: string; 
    eventName?: string; // 事件名
    src?: string;
    // value?: string;
    afterTransform?: (v: any) => any
    initalTransform?: (val: any)=>any; // 初始化参数
    // events?: { [key: string]: any }; 
}
export type PropToFroms = {
    [P in keyof TextComponentProps]?: ProptoFrom;
}
export type ImgPropToFroms = {
    [P in keyof ImageComponentProps]?: ProptoFrom;
}
const fontFamilyArr = [
    { text: '宋体', value: '"SimSun","STSong"' },
    { text: '黑体', value: '"SimHei","STHeiti"' },
    { text: '楷体', value: '"KaiTi","STKaiti"' },
    { text: '仿宋', value: '"FangSong","STFangsong"' },
]
const fontFamilyOpts = fontFamilyArr.map(font=>{
    return {
        value: font.value,
        text: h('span', {style: {fontFamily : font.value}}, font.text)
        // text: <span style={{fontFamily : font.value}} >font.text</span> as VNode
    }
})
export const ImgMapPropsToFroms: ImgPropToFroms = {
    width: {
        text: '宽度(px)',
        component: 'a-input-number',
        initalTransform: (v: string) => parseInt(v),
        afterTransform: (e: number) => e ? `${e}px` : ''
    },
    height: {
        text: '高度(px)',
        component: 'a-input-number',
        initalTransform: (v: string) => parseInt(v),
        afterTransform: (e: number) => e ? `${e}px` : ''
    },
    src: {
        text: '重选图片',
        component: 'up-loader',
        afterTransform:  (e: {src: string}) => e.src
    }
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
        afterTransform: (e: any) => e.target.value,
    },
    fontFamily: {
        component: 'a-select',
        subComponent: 'a-select-option',
        text: '字体',
        options: [
            { text: '', value: '' },
            ...fontFamilyOpts
        ]
    },
}