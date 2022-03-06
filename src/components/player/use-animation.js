import { ref } from "vue";
import animations from "create-keyframe-animation";
export default function useAnimation() {
  const cdWarpperRef = ref(null);
  let leaveing  = false
  let entering = false
  function getPosAndScale() {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scalc = targetWidth / width;
    return {
      x,
      y,
      scalc,
    };
  }
  function enter(el, done) {
    if(leaveing){
      afterLeave()
    }
    entering = true
    const { x, y, scalc } = getPosAndScale();
    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scalc})`,
      },
      100: {
        transform: `translate3d(0,0,0) scale(1)`,
      },
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 600,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
    });
    animations.runAnimation(cdWarpperRef.value, "move", done);
  }
  function afterEnter() {
    entering = false
    animations.unregisterAnimation("move");
    cdWarpperRef.value.style.animation = "";
  }
  function leave(el, done) {
    if(entering){
      afterEnter()
    }
    leaveing = true
    const { x, y, scalc } = getPosAndScale();
    const cdWarpperEl = cdWarpperRef.value;
    cdWarpperEl.style.transition = "all .6s cubic-bezier(0.45, 0, 0.55, 1)";
    cdWarpperEl.style.transform = `translate3d(${x}px,${y}px,0) scale(${scalc})`;
    cdWarpperEl.addEventListener("transitionend", next);
    function next() {
      done();
      cdWarpperEl.removeEventListener("transitionend", next);
    }
  }
  function afterLeave() {
    leaveing = false
    const cdWarpperEl = cdWarpperRef.value;
    cdWarpperEl.style.transition = "";
    cdWarpperEl.style.transform = "";
  }
  return {
    cdWarpperRef,
    enter,
    afterEnter,
    leave,
    afterLeave,
  };
}
