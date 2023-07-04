import { type FunctionalComponent } from 'vue';
import { type CardProps } from './interface';
import { Rarity, RarityToColor } from '@/components/Tags';

import { type CharacterCardProps, type BasicCardProps } from './interface';
import { GetElementPicture, ClassNameWithCSSModuleFactor } from '@/utils';

import Style from './index.module.less';

const S = ClassNameWithCSSModuleFactor(Style, 'card-');
const C = ClassNameWithCSSModuleFactor(Style, 'character-');

const CharacterCard: FunctionalComponent<CharacterCardProps, any, any> = (props, ctx) => (
  <BasicCard
    class={C({
      select: props.selected || false,
      unselect: !props.selected
    })}
    type="character"
    {...(ctx.attrs as unknown as BasicCardProps)}
  >
    <img
      class={C('element')}
      draggable={false}
      src={GetElementPicture(props.element)}
      alt="element"
    />
  </BasicCard>
);
// 处理透传
CharacterCard.props = ['selected', 'element'];

const BasicCard: FunctionalComponent<CardProps, {}, { default: any }> = (props, { slots }) => {
  return (
    <div class={S('outer')}>
      <div class={S(['photo-container', `photo-container-${RarityToColor(props.rarity)}`])}>
        <img
          draggable={false}
          src={props.imgurl}
          width="120"
        />
      </div>
      <div class={S('lvl')}>
        {props.type === 'artifact' ? '+' : 'Lv.'}
        {props.lvl}
      </div>

      <div class={S('mask')}>
        <div class={Style['star-offset']}>{slots.default()}</div>
        {props.type != 'character' && <Rarity rarity={props.rarity} />}
      </div>
    </div>
  );
};

export { CharacterCard, BasicCard };
