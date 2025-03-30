<template>
  <div class="md-editor-wrap">
    <v-md-preview :text="props.content" v-viewer></v-md-preview>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
// import './katex/katex.min.css'
import Prism from 'prismjs'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  { content: '' }
)

const componentKey = ref<number>(0)

VMdPreview.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: 'html',
    codeHighlightExtensionMap: {
      vue: 'html',
      react: 'html'
    }
  }
})

// VMdPreview.xss.extend({
//   // 扩展白名单
//   whiteList: {
//     source: ['src', 'type'],
//     iframe: [
//       'width',
//       'height',
//       'src',
//       'title',
//       'border',
//       'scrolling',
//       'frameborder',
//       'framespacing',
//       'allow',
//       'referrerpolicy',
//       'allowfullscreen'
//     ]
//   }
// })

// if (process.client) {
//   await nextTick(() => {
//     VMdPreview.use(createLineNumbertPlugin())
//     VMdPreview.use(createCopyCodePlugin())
//     VMdPreview.use(createKatexPlugin())
//   })
// }

// onMounted(() => {
//   componentKey.value++
//   nextTick(() => {
//     const dom = document.querySelector('.vuepress-markdown-body')
//     const headers = dom?.querySelectorAll('h2,h3,h4')
//     if (headers) {
//       for (let i = 0, len = headers.length; i < len; i++) {
//         const headerDom = headers[i]
//         if (headerDom) {
//           const content = headerDom.getAttribute('data-v-md-heading')
//           headerDom.id = content || ''
//         }
//       }
//     }

//     const katexs = dom?.querySelectorAll('span.katex')
//     if (katexs) {
//       for (let i = 0, len = katexs.length; i < len; i++) {
//         const katexDom = katexs[i]
//         if (katexDom) {
//           const nodeLen = katexDom.parentElement?.childNodes.length
//           if (nodeLen === 1) katexDom.classList.add('katex-center')
//         }
//       }
//     }
//   })
// })
</script>

<style scoped lang="scss">
// .md-editor-wrap {
//   :deep(.v-md-editor-preview) {
//     .vuepress-markdown-body {
//       padding: 0;
//       font-size: 1rem;
//       line-height: 2rem;
//       background-color: transparent;
//       color: inherit;

//       .v-md-pre-wrapper {
//         // background-color: var(--v-md--bg);
//         pre {
//           white-space: pre-wrap;
//         }
//       }
//       table {
//         tr {
//           background-color: transparent;
//         }
//       }
//     }
//   }
// }
</style>
