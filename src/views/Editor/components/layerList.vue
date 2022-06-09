<template>
    <ul :list="list"
        class="ant-list-items ant-list-bordered"
    >
        <li class="ant-list-item"
            v-for="item in list"
            :key="item.id"
            :class="{ active: item.id === selecetedId }"
            @click="handleClick(item.id)"
        >
            <a-tooltip :title="item.isHidden? '显示': '隐藏'">
                <a-button shape="circle" @click="handleChange(item.id, 'isHidden' ,!item.isHidden)">
                    <template v-slot:icon v-if="item.isHidden"> <eye-outlined /> </template>
                    <template v-slot:icon v-else> <eye-invisible-outlined /> </template>
                </a-button>
            </a-tooltip>
            <a-tooltip :title="item.isLocked? '解锁': '锁定'">
                <a-button shape="circle" @click="handleChange(item.id, 'isLocked' ,!item.isLocked)">
                    <template v-slot:icon v-if="item.isLocked"> <unlock-outlined /> </template>
                    <template v-slot:icon v-else> <lock-outlined /> </template>
                </a-button>
            </a-tooltip>
            <span>{{item.layerName}}</span>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EyeInvisibleOutlined, EyeOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons-vue'
import { ComponentData } from '@/store/editor'
export default defineComponent({
    name: 'layer-list',
    components: {
        EyeInvisibleOutlined,
        EyeOutlined,
        UnlockOutlined,
        LockOutlined
    },
    props: {
        list: { 
            type: Array as PropType<ComponentData[]>,
            required: true
        },
        selecetedId: { // 选中id
            type: String,
            required: true
        }
    },
    emits: ['select', 'change'],
    setup(props, { emit }) {
        const handleClick = (id: string)=>{
            emit('select', id)
        }
        // 显示 锁定变化
        const handleChange = (id: string, key: string, value: boolean)=>{
            const data = {
                id,
                key,
                value,
                isRoot: true
            }
            emit('change', data)
        }
        return {
            handleChange,
            handleClick
        }

    },
})
</script>


<style>
.active {
    border: 1px blue solid;
}
</style>