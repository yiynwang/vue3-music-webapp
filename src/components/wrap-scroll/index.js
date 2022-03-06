import scroll from '@/components/base/scroll/scroll.vue'
import { watch, computed, ref, h, nextTick,mergeProps } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'wrap-scroll',
  props: scroll.props,
  emits: scroll.emits,
  render(ctx) {
    return h(
      scroll,
      mergeProps(
        ctx.$props,
        { ref: 'scrollRef' },
        {
          onScroll: e => ctx.$emit('scroll', e)
        }
      ),
      ctx.$slots.default()
    )
  },
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)
    const store = useStore()
    const playlist = computed(() => store.state.playList)
    watch(playlist, async () => {
      await nextTick()
      console.log(scroll.value);
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
