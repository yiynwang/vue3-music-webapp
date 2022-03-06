import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
BScroll.use(Slide);
import { onMounted, onUnmounted, ref } from "vue";
export default function useSlider(wrapperRef) {
  let slider = ref(null)
  let sliderVal = slider.value
  const currentPageIndex = ref(0);
  onMounted(() => {
    sliderVal = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true,
    });
    sliderVal.on("slideWillChange", (page) => {
      currentPageIndex.value = page.pageX;
    });
  });
  onUnmounted(() => {
    sliderVal.destroy();
  });

  return {
    slider,
    currentPageIndex,
  };
}
