import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import slide from '@better-scroll/slide'
BScroll.use(slide)
export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)
  const sliderShow = computed(() => !fullScreen.value && !!playList.value.length)
  onMounted(() => {
    let sliderVal
    watch(sliderShow, async newSliderShow => {
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.on('slidePageChanged', ({ pageX: newIndex }) => {
          store.commit('setCurrentIndex', newIndex)
        })
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })
    watch(currentIndex, newIndex => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    watch(playList, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destory()
    }
  })
  return {
    sliderWrapperRef,
    slider
  }
}
