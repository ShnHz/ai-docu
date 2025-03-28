<template>
  <a-drawer
    :visible="show"
    @ok="handleOk"
    @cancel="handleClose"
    @close="handleClose"
    unmountOnClose
    :maskClosable="false"
    ok-text="确定"
    width="400px"
    class="drawer-origin-text-wrap"
    :footer="false"
  >
    <template #title>{{ title }}</template>
    <div class="content-wrap">
      {{ data.content }}
    </div>
  </a-drawer>
</template>
<script>
  export default {
    emits: ['close'],
    props: {
      data: {
        type: Object,
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      visible: function (val, oldval) {
        this.show = val
        if (this.show) {
          this.form = {
            ...this.form,
            ...this.data,
          }
        } else {
          this.form = {
            name: null,
            salary: null,
            address: null,
            email: null,
          }
        }
      },
    },
    computed: {
      title() {
        return '原文'
      },
    },
    data() {
      return {
        show: this.visible,
      }
    },
    methods: {
      handleOk() {
        let _this = this
      },
      handleClose() {
        this.$emit('close')
      },
    },
  }
</script>
<style lang="scss">
  .drawer-origin-text-wrap {
    .arco-drawer-body{
      overflow-x: hidden !important;
    }
    .content-wrap {
      width: 100%;
    }
  }
</style>
