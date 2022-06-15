<template>
    <div class="edit-grups">
        <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel v-for="(item, index) in editGroup" :key="`item-${index}`" :header="item.text">
                <!-- <h1>{{item.text}}</h1> -->
                <!-- <pre>{{item.props}}</pre> -->
                <props-table :props="item.props" @change='handlechange'></props-table>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { AllComponentProps } from '@/store/defaultProps'
import { difference } from 'lodash'
import PropsTable from '@/components/editor/PropsTable.vue'
import { useStore } from 'vuex'
export interface GroupProps {
    text: string;
    items: string[];
}

const defaultEditGroups: GroupProps[] =[
    {
        text: '尺寸',
        items: ['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']
    },
    {
        text: '边框',
        items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius']
    },
    {
        text: '阴影透明度',
        items: ['opacity', 'boxShadow']
    },
    {
        text: '位置',
        items: ['position', 'left', 'top']
    },
    {
        text: '事件功能',
        items: ['actionType', 'url']
    },
]

export default defineComponent({
    props: {
        props: {
            type: Object as PropType<AllComponentProps>,
            require: true
        },
        groups: {
            type: Array as PropType<GroupProps[]>,
            default: defaultEditGroups
        }
    },
    components: {
        PropsTable
    },
    setup(props, {emit}) {
        const store = useStore()
        const activeKey = ref<string>('item-0')
        const newGroups = computed(()=>{
            const allNormalProps = props.groups.reduce((prev, current)=>{
                return [...prev, ...current.items]
            }, [] as string[])
            const specialProps = difference(Object.keys(props.props as AllComponentProps), allNormalProps)
            // console.log('props.groups', props)
            return [
                {
                    text: '基本属性',
                    items: specialProps
                },
                ...props.groups
            ]
        })
        const editGroup = computed(()=>{
            return newGroups.value.map(group=>{
                const propsMap = {} as AllComponentProps
                group.items.forEach(item=>{
                    const key = item as keyof AllComponentProps
                    propsMap[key] = props.props![key]
                })
                return {
                    ...group,
                    props: propsMap
                }
            })
        })
        const handlechange = (e: any)=>{
            // store.commit('updateComponent', e)
            emit('change', e)
        }
        return {
            handlechange,
            activeKey,
            // newGroups,
            editGroup
        }
    },
})
</script>

<style>

</style>