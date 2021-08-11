<template>
  <div class="loader"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Loader',
    props: {
      // 是否显示加载图标
      loading: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>

</style>