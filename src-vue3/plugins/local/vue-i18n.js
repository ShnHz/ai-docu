import * as Vue from 'vue'
import VueI18n from 'vue-i18n'
window.$vueApp.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('localeLanguage') || 'zh', // 语言标识
  messages: {
    'zh-CN': require('@/assets/lang/zh'), // 中文语言包
    'en-US': require('@/assets/lang/en'), // 英文语言包
  },
  formatFallbackMessages: true, //如果在message中找不到相应的键值将回退到原本的语言
  silentTranslationWarn: true,
})

export default i18n

// 可用组件切换语言包，@/components/plugins/PluginsLanguage.vue
