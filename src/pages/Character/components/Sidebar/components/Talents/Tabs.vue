<script setup lang="ts">
import { ScrollView, HighLight } from '@/components';

import { ClassNameFactor } from '@/utils/className';
import { ref } from 'vue';

const S = ClassNameFactor('tabs-');

const talentAttris = [
  {
    label: '一段伤害',
    value: '59.9%*2'
  },
  {
    label: '二段伤害',
    value: '115.0%'
  },
  {
    label: '三段伤害',
    value: '149.5%'
  },
  {
    label: '四段伤害',
    value: '78.1%*2'
  },
  {
    label: '五段伤害',
    value: '178.0%'
  },
  {
    label: '瞄准射击',
    value: '80.6%'
  },
  {
    label: '满蓄力瞄准射击',
    value: '211%'
  },
  {
    label: '焰硝矢伤害',
    value: '28%'
  },
  {
    label: '下坠期间伤害',
    value: '104.4%'
  },
  {
    label: '低空/高空坠地冲击伤害',
    value: '209%/261%'
  }
];
const text = `$0普通攻击
进行至多五段的连续弓箭射击
    
$0重击
进行伤害更高、更为精准的$0瞄准射击。
瞄准时，火焰会在箭矢上持续积聚，并随攻击发射出去。根据蓄力时间长短，能造成不同的效果：
·一段蓄力：射出附有烈焰的箭矢，造成$1火元素伤害
·二段蓄力：依据蓄力时间，产生至多3枚焰硝矢，随宵宫这次瞄准射击释放。焰硝矢会自动追踪附近的敌人，并在命中时造成$1火元素伤害$。

$0下落攻击
从空中射出箭雨，并迅速下坠冲击地面，在落地时造成范围伤害。
          `;

const tab = ref('intro');
</script>

<template>
  <div :class="S('con')">
    <div :class="S('bar')">
      <button
        :class="
          S({
            active: tab === 'intro',
            'not-active': tab !== 'intro'
          })
        "
        @click="() => (tab = 'intro')"
      >
        天赋介绍
      </button>
      <!-- {/* 固有天赋没有详细属性 */} -->
      <button
        :class="
          S({
            active: tab === 'attri',
            'not-active': tab !== 'attri'
          })
        "
        @click="() => (tab = 'attri')"
      >
        详细属性
      </button>
    </div>
    <ScrollView
      :rootClass="S('tab-item')"
      customScrollbar="custom"
      scrollBehavior="auto"
      slide
    >
      <div :class="S({ intro: tab === 'intro' })">
        <HighLight
          v-if="tab === 'intro'"
          :text="text"
        />
        <div
          v-for="i in talentAttris"
          :key="i.value"
          :class="S('cell')"
          v-show="tab === 'attri'"
        >
          <span>{{ i.label }}</span>
          <span>{{ i.value }}</span>
        </div>
      </div>
    </ScrollView>
  </div>
</template>

<style scoped lang="less">
@import '@@/HighLight/index.less';

.tabs {
  &-con {
    flex-shrink: 1;
    flex-grow: 1;
    overflow: hidden;
  }
  &-bar {
    width: 90%;
    margin: 0 auto;
    & > button {
      display: inline-block;
      width: 50%;
      height: 40px;

      font-size: 20px;
      line-height: 40px;
      text-align: center;
      user-select: none;

      border: none;
    }
    & :first-child {
      border-radius: 30px 0 0 30px;
    }
    & :last-child {
      border-radius: 0 30px 30px 0;
    }
  }

  &-active {
    background: @blank-white;
    color: @fontdarkgray;
  }

  &-not-active {
    background: @fontlightgray;
    color: @blank-white;
    &:active {
      background-color: rgb(192, 165, 146);
    }
  }

  &-intro {
    padding: 0 20px;
  }

  &-cell {
    display: flex;
    justify-content: space-between;
    background-color: rgba(44, 52, 64, 0.697);
    margin: 7px 5px;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    border-radius: 3px;
    overflow: hidden;

    & :first-child {
      color: @fontgold;
    }
  }
}
// 滚动区域相关样式
.tabs-con {
  & :deep(.tabs-tab-item) {
    // 或者使用 flex grow 计算高度
    height: calc(100% - 60px);
    margin: 20px;
    font-size: 18px;
    font-size: 21px;
    user-select: none;
    color: @blank-white;
  }
}
</style>
