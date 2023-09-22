import { ScrollView } from '@/components';
import { EventDispatch, ClassNameWithCSSModuleFactor } from '@/utils';

import { onMounted, defineComponent, reactive, ref, provide, inject, type Ref } from 'vue';

import Style from './index.module.less';

const S = ClassNameWithCSSModuleFactor(Style, 'tabs-');

const TabsSymbol = Symbol();

interface TabPaneProps {
  tabKey: string;
  title?: string;
}

export const TabPane = defineComponent<TabPaneProps>(
  (props, { slots }) => {
    const fromTabs = inject<{
      tab: Ref<string>;
      TabPaneCollect: (s: TabPaneProps) => void;
    }>(TabsSymbol);

    onMounted(() => {
      fromTabs?.TabPaneCollect(props);
    });

    return () => (
      <>{props.tabKey === fromTabs?.tab.value && slots.default ? slots.default() : ''}</>
    );
  },
  {
    name: 'TabPane',
    props: ['tabKey', 'title']
  }
);

export const Tabs = defineComponent<
  { default?: string; disable?: string[] },
  {
    click: (tab: string) => void;
    change: (tab: string) => void;
  }
>(
  (props, { emit, slots }) => {
    const tab = ref(props.default || '');
    const Keys = reactive<TabPaneProps[]>([]);

    const TabPaneCollect = (key: TabPaneProps) => {
      if (Keys.findIndex((tp) => tp.tabKey === key.tabKey) === -1) {
        Keys.push(key);
      }

      // default 不存在 并且 tab 未被设置时，默认选取第一个作为选中值
      if (props.default === undefined && Keys.findIndex((tp) => tp.tabKey === tab.value) === -1) {
        tab.value = key.tabKey;
      }
    };

    provide(TabsSymbol, {
      tab,
      TabPaneCollect
    });

    const handleTabs = (e: Event) => {
      EventDispatch<{ key: string }>(e, {
        tab: (dataset) => {
          if ((props.disable ?? []).includes(dataset.key)) return;
          if (dataset.key !== tab.value) {
            emit('change', dataset.key);
          }
          emit('click', dataset.key);
          tab.value = dataset.key;
        }
      });
    };

    return () => (
      <div>
        <div
          class={S('nav')}
          data-type="tabs"
          onClick={handleTabs}
        >
          {Keys.map((k: TabPaneProps) => (
            <button
              key={k.tabKey}
              data-type="tab"
              data-key={k.tabKey}
              class={S({
                active: tab.value === k.tabKey,
                'not-active': tab.value !== k.tabKey,
                disable: (props.disable ?? []).includes(k.tabKey)
              })}
            >
              {k.title ?? k.tabKey}
            </button>
          ))}
        </div>
        <ScrollView
          class={S('item')}
          customScrollbar="custom"
          scrollBehavior="auto"
          slide
        >
          {slots.default && slots.default()}
        </ScrollView>
      </div>
    );
  },
  {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Tabs',
    props: ['default', 'disable']
  }
);
