<template>
    <img
        :style="styleProps"
        class="l-image-component"
        @click.prevent="handleClick"
        :src="src"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useComponentsCommon from '@/hooks/editor/useComponentsCommon'
import {
    transformToComponentProps,imageDefaultProps, imageStylePropsNames
} from '@/store/defaultProps'
const defaultProps = transformToComponentProps(imageDefaultProps)
export default defineComponent({
    name: 'l-image',
    props: {
        ...defaultProps
    },
    setup(props) {
        const { styleProps, handleClick } = useComponentsCommon(props, imageStylePropsNames)
        return {
            styleProps,
            handleClick
        }
    },
})
</script>


<style>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>