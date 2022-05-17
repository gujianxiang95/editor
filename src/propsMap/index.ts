import { TextComponentProps } from "@/store/defaultProps";
export interface ProptoFrom {
    component: string;
    value?: string
}
export type ProptoFroms = {
    [P in keyof TextComponentProps]?: ProptoFrom
}

export const mapPropsToFroms: ProptoFroms = {
    text: {
        component: 'a-input'
    }
}