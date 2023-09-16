<script setup lang="ts">
import ArtifactDetailCard from '@/components/Artifact/views/ArtifactDetailCard.vue';
import WeaponDetailCard from '@/components/Weapon/view/WeaponDetailCard.vue';
import I from '@/assets/wolfs_gravestone.webp';
import Table from '@/components/commons/Table/index.vue';
import { Message } from '@/components/commons/Message/index';
import { ref } from 'vue';

const a = {
  id: 1,
  uuid: 0,
  type: 'FlowerOfLife',
  lock: true,
  suitCount: 5,
  lvl: 20,
  main: {
    key: '生命值',
    value: '4780'
  },
  subs: [
    {
      key: '攻击力',
      value: '9.3%'
    },
    {
      key: '暴击率',
      value: '5.8%'
    },
    {
      key: '暴击率',
      value: '19.4%'
    },
    {
      key: '生命值',
      value: '299'
    }
  ]
};
const af = ref(0);
</script>

<template>
  <div style="display: flex">
    <WeaponDetailCard
      :size="40"
      :id="0"
      :type_id="0"
      :rank="6"
      :lvl="90"
      :refine="5"
      :lock="true"
      :weapon_type="{
        id: 0,
        basic: { name: '狼的末日', star: 5, type: 3, imgurl: I },
        describe:
          '狼的骑士所使的大剑。原本只是城中铁匠赠予的厚重的铁片，却在他与狼的情谊中，获得神话般的力量。',
        data: { main: [], sub: { key: 'string', start: 0, growth: 0 } },
        story: [],
        effects: {
          name: '如狼般狩猎者',
          describe:
            ' · 攻击力提高$1；攻击命中生命值低于30%的敌人时队伍中所有成员的攻击力提高$2，持续12秒。该效果30秒只能触发一次。',
          $: [
            ['20%', '25%', '30%', '35%', '40%'],
            ['40%', '50%', '60%', '70%', '80%']
          ]
        }
      }"
    />
    <ArtifactDetailCard
      :size="40"
      v-bind="a"
    />
  </div>
  <Table></Table>
  <button
    @click="
      () => {
        Message.success(af);
        Message.info(af);
        Message.error(af);
        af++;
      }
    "
  >
    cl9ic
  </button>
</template>

<style scoped lang="less">
.root {
  height: 500px;
}

.test {
  width: 500px;
  height: 800px;
}
</style>
