<template>
    <component :is="tag" :style="styleProps" class="l-text-component pointer" @click="handleClick">
        {{ text }}
    </component>
</template>

<script lang="ts">
import { transformToComponentProps, textDefaultProps, textStylePropsNames } from '@/store/defaultProps'
import { computed, defineComponent } from 'vue'
import useComponentsCommon from '@/hooks/editor/useComponentsCommon'

const defaultProps = transformToComponentProps(textDefaultProps)

export default defineComponent({
    name: 'l-text',
    props: {
        ...defaultProps,
        tag: {
            type: String,
            default: 'div'
        }
    },
    setup (props) {
        // console.log(defaultProps )
        const { styleProps, handleClick } = useComponentsCommon(props, textStylePropsNames)
        return {
            styleProps,
            handleClick
        }
    }
})

</script>
