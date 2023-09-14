<script setup lang="ts">
interface WeaponDescribeProps {
  refine: number;
  effect: {
    name: string;
    describe: string;
    $: (number | string)[][];
  };
}

const props = withDefaults(defineProps<WeaponDescribeProps & { size?: number }>(), {
  size: 50
});

const describeDecoder = (code: string) => {
  const decode = [];
  let str = '';
  let i = 0;
  while (i < code.length) {
    if (code[i] !== '$') {
      str += code[i];
    } else {
      // 提交文本部分
      decode.push({
        type: 'text',
        value: str
      });
      str = '';
      // 提交数值部分

      decode.push({
        type: 'value',
        value: code[i + 1]
      });
      i++;
    }
    i++;
  }

  if (str !== '') {
    decode.push({
      type: 'text',
      value: str
    });
  }
  return decode;
};
const valueDecoder = (value: string) => {
  const data = props.effect['$'][Number(value) - 1];
  if (props.refine == 0) {
    // group
    const group = [
      {
        type: 'text',
        value: '('
      }
    ];
    data.forEach((v, i) => {
      group.push({
        type: 'value',
        value: '' + v
      });
      if (i !== data.length - 1) {
        group.push({
          type: 'text',
          value: ' , '
        });
      }
    });
    group.push({
      type: 'text',
      value: ')'
    });
    return group;
  } else {
    return [
      {
        type: 'value',
        value: data[props.refine - 1]
      }
    ];
  }
};
</script>

<template>
  <div :style="`--title-height: ${size}px`">
    <div>{{ effect.name }}</div>
    <div class="weapon-describe-content">
      <template
        v-for="(des, index) in describeDecoder(effect.describe)"
        :key="index"
      >
        <span
          v-if="des.type === 'text'"
          class="weapon-inhert"
          >{{ des.value }}
        </span>
        <template
          v-else
          v-for="(v, index) in valueDecoder(des.value)"
          :key="index"
        >
          <span :class="{ 'weapon-blue': v.type === 'value', 'weapon-inhert': v.type === 'text' }">
            {{ v.value }}
          </span>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.weapon-blue {
  color: rgb(56, 153, 202);
}
.weapon-inhert {
  color: inherit;
}
.weapon-describe-content {
  word-break: break-all;
}
</style>
