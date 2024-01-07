<script setup lang="ts">
import Popover from '@/components/commons/Popover/index.vue';
import type { Thumb, TimeLineGroupThumbColor, TimeLineGroupTrackColor } from '../interface';
defineProps<{
  trackColor: TimeLineGroupTrackColor;
  thumbColor: TimeLineGroupThumbColor;
  thumbs: Thumb[][];
  radius: number;
  minUnit: number;
  payload: object;
  box: {
    width: number;
    height: number;
  };
}>();
</script>

<template>
  <div>
    <div
      class="track"
      v-for="(track, trackIndex) in thumbs"
      :style="{
        borderRadius: `${radius}px`,
        height: `${box.height}px`,
        minWidth: `${box.width}px`,
        backgroundColor:
          typeof trackColor === 'string' ? trackColor : trackColor(trackIndex, payload)
      }"
      :key="trackIndex"
    >
      <Popover
        v-for="(thumb, thumbIndex) in track"
        :key="thumbIndex"
        :content="thumb?.payload?.popover && thumb.payload.popover(thumb)"
      >
        <span
          class="item"
          :style="{
            backgroundColor:
              typeof thumbColor === 'string'
                ? thumbColor
                : thumbColor(trackIndex, thumbIndex, thumb.payload),
            width: `${(thumb.last / minUnit) * 2 * radius}px`,
            marginLeft: `${(thumb.space / minUnit) * 2 * radius}px`,
            borderRadius: `${radius}px`
          }"
        ></span
      ></Popover>
    </div>
  </div>
</template>

<style scoped lang="less">
.track {
  margin: 5px;
  white-space: nowrap;
  overflow: hidden;
}

.item {
  height: 25px;
  display: inline-block;
}
</style>
