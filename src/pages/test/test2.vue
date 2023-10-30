<script setup lang="ts">
import { HighLight } from '@/components';


const text = `$0普通攻击$
进行至多五段的连续弓箭射击
    
$0$8重击$$
进行伤害更高、更为精准的$0瞄准射击$。
瞄准时，火焰会在箭矢上持续积聚，并随攻击发射出去。根据蓄力时间长短，能造成不同的效果：
·一段蓄力：射出附有烈焰的箭矢，造成$1火元素伤害$。
·二段蓄力：依据蓄力时间，产生至多3枚焰硝矢，随宵宫这次瞄准射击释放。焰硝矢会自动追踪附近的敌人，并在命中时造成$1火元素伤害$。

$0下落攻击$
从空中射出箭雨，并迅速下坠冲击地面，在落地时造成范围伤害。`;

/**
 *  => [
 * { style: '$0', text: '普通攻击'}, {}]
 */
const text2 = "展开$0摩耶之殿$计算队伍中特定元素类型的角色数量时，额外计入$1火元素$、$3雷元素$、$2水元素$的角色各1名。"
</script>

<template>
  <div class="ss">
    <HighLight :text="text2" />
  </div>
</template>

<style scoped lang="less">
.ss {
  background: black;
  font-size: 26px;
  height: 100vh;
  color: @blank-white;
}
</style>
