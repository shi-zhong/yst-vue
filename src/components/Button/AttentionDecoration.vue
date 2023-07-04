
<template>
  <div class="decoration-attention"></div>
</template>

<style scoped lang="less">
.decoration {
  &-attention {
    background-color: rgb(255, 40, 40);
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;

    &::before {
      content: '';
      display: block;
      width: 26%;
      height: 52%;
      margin: 5% 37%;
      border-radius: 50%;
      background-color: rgb(235, 203, 196);
    }

    &::after {
      content: '';
      display: block;
      width: 25%;
      height: 25%;
      margin: 10% 37.5%;
      border-radius: 50%;
      background-color: rgb(235, 203, 196);
    }
  }
}
</style>