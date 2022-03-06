import { computed, ref } from "vue";
export default function useShortCut(props, groupRef) {
  const scrollRef = ref(null);
  const ANCHOR_HEIGHT = 18;
  const touch = {};
  const shortcutList = computed(() => {
    return props.data.map((group) => group.title);
  });
  function onShortcutTouchStart(e) {
    touch.y1 = e.touches[0].pageY;
    const anchorIndex = parseInt(e.target.dataset.index);
    touch.anchorIndex = anchorIndex;
    scrollTo(anchorIndex);
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0; // x|0取整
    const anchorIndex = touch.anchorIndex + delta;
    scrollTo(anchorIndex);
  }

  function scrollTo(index) {
    if (isNaN(index)) return;
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
    const targetEl = groupRef.value.children[index];
    const scroll = scrollRef.value.scroll;
    scroll.scrollToElement(targetEl, 0); // better-scroll 插件提供的方法
  }
  return { shortcutList, onShortcutTouchStart, onShortcutTouchMove, scrollRef };
}
