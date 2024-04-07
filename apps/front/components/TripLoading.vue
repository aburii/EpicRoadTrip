<template>
  <div class="flex items-center justify-center bg-white h-screen w-screen relative">
    <img
      src="https://i.pinimg.com/originals/43/3b/6c/433b6c5336c72a21bcfd9db8d831562a.gif"
      alt="Loading"
    />
    <h2
      class="absolute inset-0 flex items-center justify-center text-xl lg:text-2xl top-1/3 text-center mx-8"
    >
      <AppTextWriter
        id="loadingSentences"
        :duration="0.5"
        :sentences="loadingSentences"
        :interval="1000"
      />
    </h2>
  </div>
</template>

<script setup>
const { tm } = useI18n();
const loadingSentences = tm('trip.loadingSentences');
</script>
