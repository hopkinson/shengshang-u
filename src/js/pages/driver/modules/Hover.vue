<style lang="css" scoped>
.cs-home__hover--icon {
    width: 120px;
    height: 120px;
}
</style>

<template>
<div class="cs-home__hover">
    <image src="bmlocal://assets/vehicles.png" class="cs-home__hover--icon" @click="handleClick"></image>
</div>
</template>

<script>
export default {
    data: () => ({

    }),
    created() {},
    methods: {
        // 去 ‘我的消息’
        handleClick(e) {
            this.$emit('click', e)
        }
    }
}
</script>
