<script setup lang="tsx">
import { TimeLine } from '@/components/TimeLine/index';
import TimeLineVue from '@/components/TimeLine/view/TimeLine.vue';

const tl = new TimeLine();

const tlg = tl.addGroup('XiangLing');
const tlg2 = tl.addGroup('LingHua');

tlg.addItem(100, 100);
tlg2.addItem(100, 100);

const ida = tlg.addItem(500, 1000, {
  popover: (t) => {
    return (
      <div>
        <div>start:{t.start / 100}</div>
        <div>last: {t.last / 100}</div>
      </div>
    );
  },
  text: 'red'
});

const idb = tlg.addItemAfter(ida.id, 500, 500)!;

const idc = tlg.addItemAfter(idb.id, 500, 500)!;

const idd = tlg.addItemAfter(idc.id, 500, 500);

tlg.addItem(1000, 200);

tlg.addItem(4300, 500);

tlg.addItem(4300, 500);
</script>

<template>
  <TimeLineVue
    title="this is the time line"
    :minUint="100"
    :zoom="{
      min: 1,
      max: 10
    }"
    :defaultZoom="1"
    :timeLine="tl.buildTimeLine()"
  />
</template>

<style scoped lang="less"></style>
