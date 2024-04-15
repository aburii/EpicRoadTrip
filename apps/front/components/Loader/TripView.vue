<template>
  <div class="flex flex-col rounded-lg overflow-hidden shadow-md my-4">
    <div class="flex justify-between items-start">
      <div class="p-4 flex-grow">
        <p class="text-md lg:text-lg">
          <USkeleton class="h-5 w-1/2 my-2" />
        </p>
        <p class="text-md lg:text-lg">
          <USkeleton class="h-5 w-1/3 my-2" />
        </p>
      </div>
    </div>
    <USkeleton class="h-64 w-full" />
    <div class="my-2">
      <div class="p-4 text-lg">
        <div class="timeline">
          <div v-for="i in 2" :key="i" class="timeline-item">
            <div class="timeline-marker">
              <span class="index"></span>
            </div>
            <div class="timeline-content">
              <USkeleton class="h-5 w-1/5 my-2" />
              <USkeleton class="h-5 w-1/3 my-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: #ff6b00;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -15px;
  width: 10px;
  height: 10px;
  background: #ff6b00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-marker .index {
  color: white;
  font-size: 12px;
}

.timeline-content {
  padding-left: 20px;
}
</style>
