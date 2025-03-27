<template>
  <div class="docu-wrap">
    <div class="upload-wrap">
      <a-upload
        draggable
        action="/"
        :limit="1"
        :custom-request="handleUploadChange"
        :on-before-remove="handleUploadBeforeRemove"
      />
      <a-button
        type="primary"
        :disabled="!params.file || loading"
        @click="handleConfirm"
      >
        <template v-if="loading">
          <span style="margin-right: 10px">正在分析</span> <a-spin :size="12" />
        </template>
        <template v-else>开始分析</template>
      </a-button>
    </div>
  </div>
</template>
<script>
  import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'

  export default {
    name: 'views-table',
    components: {
      IconPlus,
      IconEdit,
      IconDelete,
    },
    data() {
      return {
        loading: false,
        params: {
          file: null,
        },
      }
    },
    computed: {},
    mounted() {
      this.params = {
        ...this.params,
        ...this.urlGetParams(this.$route.query),
      }
    },
    methods: {
      getInfo() {},
      handleUploadChange(option) {
        try {
          const { onProgress, onError, onSuccess, fileItem, name } = option
          const file = fileItem.file
          if (!['application/pdf'].includes(file.type)) {
            onError()
            this.$message.warning('仅支持pdf文件上传!')
            return
          }
          this.params.file = file
          onProgress(1)
          onSuccess()
        } catch (e) {
          console.error(e)
        }
      },
      handleUploadBeforeRemove() {
        this.params.file = null
        return true
      },
      paramsChange() {},
      async handleConfirm() {
        const form = new FormData()
        form.append('file', this.params.file)
        // 调试方式 - 可以查看是否成功添加了文件
        for (let [key, value] of form.entries()) {
          console.log(key, value)
        }
        this.loading = true
        await this.$api.moonshot.getMessage(form)
        this.loading = false
      },
    },
  }
</script>
<style scoped lang="scss">
  .docu-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    .upload-wrap {
      width: 778px;
    }
    :deep(.arco-btn) {
      margin-top: 10px;
      width: 100%;
    }
  }
</style>
