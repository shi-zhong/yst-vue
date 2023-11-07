<script setup lang="ts">
defineProps<{
  title: string;
  subTitle?: string;
  intro?: string;
  list?: { key: string; value: string }[];
}>();
</script>

<template>
  <div class="basic-data-container">
    <div class="name">
      <div>{{ title }}</div>
      <div>{{ subTitle }}</div>
    </div>
    <div class="list">
      <div
        class="list-item"
        v-for="l in list"
        :key="l.key"
      >
        <span>{{ l.key }}</span>
        <span>{{ l.value }}</span>
      </div>
    </div>
    <div class="intro">{{ intro }}</div>
  </div>
</template>

<style scoped lang="less">
.basic-data-container {
  height: 100%;
  padding: 40px 0;
  box-sizing: border-box;
  margin: 0 50px;

  color: @blank-white;
}
.name {
  font-size: 28px;
  height: 70px;
  border-bottom: 1px solid @blank-white;
  & :nth-child(2) {
    font-size: 25px;
    opacity: 0.8;
  }
}

.list {
  margin: 20px 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 3px;
  font-size: 20px;
  &:nth-child(2n) {
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.1), transparent);
  }
}

.intro {
  font-size: 20px;
  opacity: 0.8;
}
</style>
