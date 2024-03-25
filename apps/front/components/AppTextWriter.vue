<script setup lang="ts">
import { gsap } from "gsap";

const props = defineProps<{
  id: string;
  sentences: string[];
  interval: number;
  duration: number;
}>();

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const gsapTextInterval = useIntervalFn(
  () => {
    if (!document || props.sentences.length <= 0) {
      return;
    }

    const tl = gsap.timeline({ yoyo: true });

    tl.to(`#${props.id}`, {
      duration: 1,
      text: props.sentences[
        randomIntFromInterval(0, props.sentences.length - 1)
      ],
    });
  },
  2000,
  {
    immediateCallback: false,
    immediate: false,
  },
);

onMounted(() => {
  gsap.defaults({ ease: "none" });
  gsapTextInterval.resume();
});
</script>

<template>
  <span :id="id"></span>
</template>

<style scoped></style>
