<template>
  <div class="docu-wrap">
    <div class="content-wrap">
      <a-button
        @click="handleOpenOriginText"
        v-if="drawer.drawerOriginText.data"
        style="margin-bottom: 10px"
      >
        原文
      </a-button>

      <a-upload
        draggable
        action="/"
        :limit="1"
        :custom-request="handleUploadChange"
        :on-before-remove="handleUploadBeforeRemove"
      />

      <!-- <div class="tree-wrap">
        <a-tree
          v-if="analysisTitles.length > 0"
          :checkable="true"
          v-model:checked-keys="params.analysisTitles"
          :check-strictly="false"
          :data="analysisTitles"
          showLine
          checked-strategy="child"
        />
      </div> -->

      <a-button
        type="primary"
        @click="handleConfirm"
        :disabled="!params.file || loading"
      >
        <template v-if="loading">
          <span style="margin-right: 10px">正在分析</span> <a-spin :size="12" />
        </template>
        <template v-else>开始分析</template>
      </a-button>

      <div
        class="tab-wrap"
        v-if="data.articleAnalysis && data.articleAnalysis.length > 0"
      >
        <a-tabs
          v-model:activeKey="activeTab"
          position="left"
          scrollPosition="auto"
          style="width: 100%; margin-top: 20px"
        >
          <a-tab-pane
            v-for="(item, index) in data.articleAnalysis"
            :key="item.title"
            :title="item.title"
          >
            <a-split
              :style="{
                height: '100%',
                width: '100%',
                border: '1px solid var(--color-border)',
              }"
            >
              <template #first>
                <md-editor :content="item.content1" />
              </template>
              <template #second>
                <md-editor :content="item.content2" />
              </template>
            </a-split>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>

  <DrawerOriginText
    :visible="drawer.drawerOriginText.visible"
    :data="drawer.drawerOriginText.data"
    @close="drawer.drawerOriginText.visible = false"
  />
</template>
<script>
  import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
  import DrawerOriginText from '@/components/ai/docu/drawer/DrawerOriginText.vue'
  import MdEditor from '@/components/ai/docu/MdEditor.vue'

  export default {
    name: 'views-table',
    components: {
      IconPlus,
      IconEdit,
      IconDelete,
      DrawerOriginText,
      MdEditor,
    },
    data() {
      return {
        loading: false,
        step: 1,
        activeTab: '',
        params: {
          file: null,
          fileName: '',
          analysisTitles: [],
        },
        drawer: {
          drawerOriginText: {
            visible: false,
            data: null,
          },
        },
        data: {
          articleAnalysis: [],
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
          this.params.fileName = file.name
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
        this.loading = true
        if (this.step == 1) {
          await this.step1()
        }
        // else if (this.step == 2) {
        //   await this.step2()
        // }
        this.step++
        this.loading = false
      },
      async step1() {
        const form = new FormData()
        form.append('file', this.params.file)
        form.append('fileName', this.params.fileName)

        const res = await this.$api.moonshot.getMessage(form)
        this.drawer.drawerOriginText.data = JSON.parse(res.data.originText)
        this.data.articleAnalysis = res.data.data
        if (this.data.articleAnalysis && this.data.articleAnalysis.length > 0) {
          this.activeTab = this.data.articleAnalysis[0].title
          console.log(this.activeTab)
        }
        // this.analysisTitles = buildTreeFromText(res.data.content) || []

        function buildTreeFromText(text) {
          const cleanedText = text
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
            .replaceAll(/【/g, '[')
            .replaceAll(/】/g, ']')
            .replaceAll(/（/g, '(')
            .replaceAll(/）/g, ')')

          const pattern = /(\[第.+?部分\]\(第.+?小点\))/g
          const sections = cleanedText.split(pattern)

          const result = {}
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i]
            if (section) {
              const matchResult = section.match(pattern)
              if (matchResult) {
                const nextstr = sections[i + 1]
                const title = section
                  .replaceAll('[', '')
                  .replaceAll(']', '')
                  .replace('第', '')
                  .replaceAll('部分', '')
                  .replace(/\(第(.+)小点\)/, '')
                const subtitle = section.replace(`[第${title}部分]`, '')

                if (!result[title]) {
                  result[title] = {
                    title: `第${title}部分`,
                    key: `第${title}部分`,
                    children: [
                      {
                        title: `${subtitle
                          .replace('(', '')
                          .replace(')', '')} ${nextstr}`,
                        key: section,
                        value: nextstr,
                      },
                    ],
                  }
                } else {
                  result[title].children.push({
                    title: `${subtitle
                      .replace('(', '')
                      .replace(')', '')} ${nextstr}`,
                    key: section,
                    value: nextstr,
                  })
                }
                i++
              }
            }
          }

          const treeData = []
          for (let k in result) {
            treeData.push(result[k])
          }

          return treeData
        }
      },
      async step2() {
        const form = new FormData()
        form.append('anlysisTitles', this.params.analysisTitles)
        const res = await this.$api.moonshot.getMessage(form)?.data
        this.analysisTitles = buildTreeFromText(res.data.content) || []
      },
      handleOpenOriginText() {
        this.drawer.drawerOriginText.visible = true
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
    max-height: calc(100vh - 60px - 55px);
    overflow-y: auto;
    overflow-x: hidden;
    .content-wrap {
      width: 100%;
      padding: 10px 0;
      .tree-wrap {
        max-height: 300px;
        overflow-y: auto;
        position: relative;
        margin-top: 10px;
      }
      .tab-wrap {
        height: 500px;
        :deep(.arco-tabs) {
          height: 100%;
          .arco-tabs-content {
            width: calc(100vw - 280px - 48px - 96px);
          }
          .arco-tabs-content-item{
            height: 500px;
            overflow-y: auto;
            .arco-split-trigger-vertical{
              height: auto;
            }
          }
        }
      }
    }
    :deep(.arco-btn) {
      margin-top: 10px;
      width: 100%;
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>
