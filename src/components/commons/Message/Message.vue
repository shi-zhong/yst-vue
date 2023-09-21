<script setup lang="ts">
import { Queue } from './index';
</script>

<template>
  <TransitionGroup name="msg">
    <div
      v-for="msg of Queue.queue"
      :class="'msg ' + msg.style"
      :key="msg.text"
    >
      {{ msg.text }}
    </div>
  </TransitionGroup>
</template>

<style scoped lang="less">
.msg {
  height: 40px;
}

.success {
  color: @fontdarkgray;
}

.info {
  color: @fontlightgray;
}

.error {
  // color: @blank-white;
  color: @lock-color;
}

.msg-move, /* 对移动中的元素应用的过渡 */
.msg-enter-active,
.msg-leave-active {
  transition: all 0.5s ease;
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.msg-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.msg-leave-active {
  width: 100%;
  position: absolute;
}
</style>
