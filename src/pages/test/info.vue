<script setup lang="ts">
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';
import { ref, watch } from 'vue';

const store = useCharacterLayoutStore();

const names = {
  生日: 'birth',
  所属: 'belong',
  元素: 'element',
  命之座: 'life',
  称号: 'honor',
  突破属性: 'break_through'
} as const;

const eName = ref(store.characterStatic?.basic.eName ?? '');
// const eName = ref(store.characterStatic?.basic.eName ?? '');

watch(
  () => eName,
  () => {
    store.updateEName(eName.value);
  }
);
</script>

<template>
  <div class="basic-data-container">
    <div class="name">
      <div>{{ store.characterStatic?.basic.name }}</div>
      <input
        type="text"
        v-model="eName"
        placeholder="唯一英文名"
      />
    </div>
    <div class="list">
      <div
        class="list-item"
        v-for="(v, k) in names"
        :key="k"
      >
        <span>{{ k }}</span>
        <span>{{ store.characterStatic!.basic[v] }}</span>
      </div>
    </div>
    <div class="intro">{{ store.characterStatic?.basic.intro }}</div>
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
  & > input {
    outline: none;
    background-color: transparent;
    color: @blank-white;
    border: none;
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
