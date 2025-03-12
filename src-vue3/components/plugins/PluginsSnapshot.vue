<template>
  <span class="snapshot"></span>
</template>

<script>
import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
import domtoimage from 'dom-to-image'

export default {
  props: {
    target: {
      type: String,
      default: 'target',
    },
  },
  methods: {
    snapshotToJpeg() {
      let _this = this
      domtoimage
        .toJpeg(document.getElementById(this.target), { quality: 0.95 })
        .then(function (dataUrl) {
          $emit(_this, 'finish', dataUrl)
        })
    },
    snapshotToPng() {
      let _this = this
      domtoimage
        .toPng(document.getElementById(this.target))
        .then(function (dataUrl) {
          $emit(_this, 'finish', dataUrl)
        })
    },
    snapshotToBlob() {
      let _this = this
      domtoimage
        .toBlob(document.getElementById(this.target))
        .then(function (blob) {
          $emit(_this, 'finish', blob)
        })
    },
  },
  emits: ['finish'],
}
</script>

<style lang="scss" scoped>
.snapshot {
}
</style>
