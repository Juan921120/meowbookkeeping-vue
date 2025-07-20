<template>
    <div class="jagged-wrapper">
        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
// 可以添加 props 来定制样式
const props = defineProps({
    borderColor: {
        type: String,
        default: '#333'
    },
    borderWidth: {
        type: String,
        default: '3px'
    },
    borderRadius: {
        type: String,
        default: '12px'
    },
    background: {
        type: String,
        default: 'white'
    }
})
</script>

<style scoped>
.jagged-wrapper {
    position: relative;
    display: block;
    width: 100%;
    border-radius: v-bind('borderRadius');
    overflow: hidden;
}

.jagged-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: v-bind('borderWidth') solid v-bind('borderColor');
    border-radius: v-bind('borderRadius');
    filter: url(#jagged-border);
    pointer-events: none;
    z-index: 1;
}

.card-content {
    background: v-bind('background');
    padding: 20px;
    border-radius: v-bind('borderRadius');
    position: relative;
    z-index: 0;
}
</style>
