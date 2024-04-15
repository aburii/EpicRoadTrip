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
    <div class="p-4">
      <USkeleton class="h-5 w-1/3 my-2" />
    </div>
    <div class="p-4 text-lg">
      <USkeleton class="h-5 w-1/5 my-2" />
      <USkeleton class="h-5 w-1/3 my-2" />
    </div>
  </div>
</template>
