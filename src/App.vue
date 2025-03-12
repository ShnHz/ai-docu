/*
 * @Author: sanghangning 
 * @Date: 2019-12-11 10:47:14 
 * @Last Modified by: sanghangning
 * @Last Modified time: 2021-08-11 11:30:14
 */
 
<template>
  <div id="app" class="app-wrap">
    <content>
      <router-view class="router-view-wrap" id="routerView" />
    </content>
  </div>
</template>

<style lang="scss" scoped>
.app-wrap {
  content {
    display: block;
    min-height: calc(100vh);
  }
  .router-view-wrap {
    min-height: calc(100vh);
    background: var(--viewBg);
  }
}
</style>
