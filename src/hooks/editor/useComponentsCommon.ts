import { TextComponentProps } from '@/store/defaultProps'
import { pick } from 'lodash'
import { computed } from 'vue'

const useComponentsCommon = (props: Readonly<Partial<TextComponentProps>>, picks: string[])=>{
    const styleProps = computed(()=>pick(props, picks))
    const handleClick = ()=>{
        if(props.actionType === 'url' && props.url){
            window.location.href = props.url
        }
    }
    return {
        styleProps,
        handleClick
    }
}
export default useComponentsCommon