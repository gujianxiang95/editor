<template>
    <component :is="tag" :style="styleProps" class="l-text-component" @click="handleCLick">
        {{ text }}
    </component>
</template>

<script lang="ts">
import { transformToComponentProps, textDefaultProps, textStylePropsNames } from '@/store/defaultProps'
import { pick } from 'lodash'
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
        const { styleProps, handleCLick } = useComponentsCommon(props, textStylePropsNames)
        console.log('styleProps', styleProps)
        return {
            styleProps,
            handleCLick
        }
    }
})
</script>
