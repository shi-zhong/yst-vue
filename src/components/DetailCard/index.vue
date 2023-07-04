<script setup lang="ts">
import { Rarity, RarityToColor } from '@/components/Tags';
import { ClassNameFactor } from '@/utils/className';
import { toRefs } from 'vue';

interface BasicDetailCardProps {
  title: string;
  type: string;
  main: {
    key: string;
    value: string;
    [key: string]: any;
  };
  sub?: {
    key: string;
    value: string;
    [key: string]: any;
  };
  rarity: 1 | 2 | 3 | 4 | 5;
  imgUrl: string;
}

const props = defineProps<BasicDetailCardProps>();

const { title, type, sub, main, rarity, imgUrl } = toRefs(props);

const S = ClassNameFactor('common-detail-card');

// const WeaponDetailCard = (props: WeaponDetailCardProps) => {
//   return (
//     <BasicDetailCard {...props}>
//       <div>
//         <div>
//           <RankBar rank={props.rank} />
//         </div>
//       </div>
//     </BasicDetailCard>
//   );
// };
</script>

<template>
  <div :class="S()">
    <div :class="S({ '-title': ['', `-${RarityToColor(rarity)}`] })">
      <p>{{ title }}</p>
    </div>
    <div :class="S({ '-attribute': ['', `-${RarityToColor(rarity)}`] })">
      <div :class="S(['-attribute-data'])">
        <div>{{ type }}</div>
        <div>{{ sub?.key || '' }}</div>
        <div>{{ sub?.value || '' }}</div>
        <div>{{ main.key }}</div>
        <div>{{ main.value }}</div>
        <Rarity
          :rarity="rarity"
          align="left"
          :size="30"
        />
      </div>
      <div>
        <img
          :draggable="false"
          :src="imgUrl"
          alt="img"
        />
      </div>
    </div>
    <div :class="S(['-describe'])"><slot></slot></div>
  </div>
</template>

<style scoped lang="less">

@title-height: 50px;
@leftindent: @title-height / 2;


.common-detail-card {
  margin: 10px;
  width: 9 * @title-height;
  box-shadow: @box-shadow;
  user-select: none;

  @title-border: @title-height / 17;

  &-title {
    position: relative;
    height: @title-height;
    padding: @title-border;

    & > p {
      width: 100%;
      height: 100%;
      line-height: 14 * @title-height / 17;
      border: @title-border solid rgba(56, 56, 56, 0.2);
      padding-left: @leftindent;
      margin: 0;

      font-size: @title-height / 2;

      color: @blank-white;
    }

    &-golden {
      background: @rank-golden-bar;
    }
    &-purple {
      background: @rank-purple-bar;
    }
    &-blue {
      background: @rank-blue-bar;
    }
    &-green {
      background: @rank-green-bar;
    }
    &-gray {
      background: @rank-gray-bar;
    }
  }

  &-attribute {
    height: 4 * @title-height;

    &-golden {
      background: @rank-golden-gradient-box;
    }
    &-purple {
      background: @rank-purple-gradient-box;
    }
    &-blue {
      background: @rank-blue-gradient-box;
    }
    &-green {
      background: @rank-green-gradient-box;
    }
    &-gray {
      background: @rank-gray-gradient-box;
    }

    & > div {
      display: inline-block;
      vertical-align: top;
      height: 100%;
      &:first-child {
        padding-top: 5px;
        width: 5 * @title-height;
      }
      &:last-child {
        width: 4 * @title-height;
      }
    }

    &-data {
      padding-left: @leftindent + 4;
      & > div {
        @attribute-base-height: @title-height / 2;
        @attribute-base-font-size: @title-height / 4;

        padding: 2px 0;
        line-height: @title-height / 1.5;
        box-sizing: border-box;

        &:nth-child(1),
        &:nth-child(3) {
          height: @attribute-base-height;
          color: @blank-white;

          font-size: @attribute-base-font-size * 1.3;
        }

        &:nth-child(3) {
          font-size: @attribute-base-font-size * 1.8;
        }

        &:nth-child(2),
        &:nth-child(4) {
          height: @attribute-base-height;
          color: @blank-white;
          font-size: @attribute-base-font-size * 1.3;
          opacity: 0.5;
        }
        &:nth-child(5) {
          height: @title-height;
          line-height: @title-height;
          font-size: @attribute-base-font-size * 3;
          color: @blank-white;
        }
        &:nth-child(6) {
          height: @title-height;
        }
      }
    }

    & > div > img {
      width: 4 * @title-height;
    }
  }

  &-describe {
    background: @blank-white;
    padding: 15px @leftindent + 4 60px @leftindent + 4;
    min-height: 4 * @title-height;
  }
}
</style>
