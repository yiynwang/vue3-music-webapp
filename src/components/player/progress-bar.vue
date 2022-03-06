<template>
  <div class="progress-bar">
    <div class="bar-inner" @click="onClick">
      <div class="progress" :style="progressStyle" ref="progress"></div>
      <div
        class="progress-btn-warpper"
        :style="btnStyle"
        @touchstart.prevent="onTouchstart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const progressBrnWidth = 16
export default {
  emits: ['pregress-chnaging', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    progressStyle() {
      return {
        width: `${this.offset}px`
      }
    },
    btnStyle() {
      return {
        transform: `translate3d(${this.offset}px,0,0)`
      }
    }
  },
  watch: {
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  methods: {
    setOffset(newProgress) {
      const barWidth = this.$el.clientWidth - progressBrnWidth
      this.offset = barWidth * newProgress
    },
    onClick(e) {
      const rect = this.$el.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const barWidth = this.$el.clientWidth - progressBrnWidth
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onTouchstart(e) {
      this.touch.x1 = e.touches[0].pageX
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    onTouchMove(e) {
      const delta = e.touches[0].pageX - this.touch.x1
      const tempWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBrnWidth
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      this.offset = barWidth * progress
      this.$emit('progress-changing', progress)
    },
    onTouchEnd(e) {
      const barWidth = this.$el.clientWidth - progressBrnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.offset = this.$refs.progress.clientWidth
      this.$emit('progress-changed', progress)
    }
  },
  created() {
    this.touch = {}
  }
}
</script>
<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      background-color: $color-theme;
      height: 100%;
      position: absolute;
    }
  }
  .progress-btn-warpper {
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
  }
  .progress-btn {
    position: absolute;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 3px solid $color-text;
    border-radius: 50%;
    background-color: $color-theme;
  }
}
</style>
