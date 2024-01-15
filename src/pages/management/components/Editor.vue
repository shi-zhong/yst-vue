<script setup lang="ts">
import { Drop } from '@/utils/directive';
import { DropFile } from '@/components';
import { Icon } from '@shi-zhong/genshin-ui';

const { vDrop } = Drop();

const emits = defineEmits<{
  (e: 'drop', text: string, file: File): void;
  (e: 'preview'): void;
  (e: 'close'): void;
  (e: 'save'): void;
}>();

defineProps<{ isNew: boolean; title?: string; using: boolean; icon: string; preview?: boolean }>();
</script>

<template>
  <DropFile
    class="editor"
    v-drop="(text: string, file: File) => emits('drop', text, file)"
  >
    <template v-slot:default="willdrop">
      <div class="tool">
        <span>编辑器·{{ isNew ? '修改' : '新建' }}{{ willdrop.willdrop ? '·释放新建' : '' }}</span>
        {{ title ?? '' }}
        <div>
          <button
            v-if="preview && using"
            @click="() => emits('preview')"
          >
            预览
          </button>
          <button @click="() => emits('close')">关闭</button>
          <button @click="() => emits('save')">保存</button>
        </div>
      </div>
      <slot v-if="using"></slot>
      <div
        class="blank"
        v-else
      >
        <Icon
          :src="icon"
          :size="120"
          type="projection"
          color="rgba(72, 85, 103,0.5)"
        />
      </div>
    </template>
  </DropFile>
</template>

<style scoped lang="less">
.editor {
  & :where(input, textarea)::placeholder,
  &::-webkit-input-placeholder {
    // color: red;
    color: rgba(0, 0, 0, 0.2);
  }

  margin: 30px;
  min-width: 1008px;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px @fontlightgray;
  display: flex;
  flex-flow: column;
  overflow: hidden;
}

.tool {
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  & button {
    background-color: transparent;
    border: 0;
    font-size: 20px;
    &:hover {
      color: @fontlightgray;
    }
    &:active {
      opacity: 0.8;
    }
  }
}

.blank {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
