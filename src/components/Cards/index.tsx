import { type FunctionalComponent } from 'vue';
import { type CardProps } from './interface';
import { Rarity, RarityToColor } from '@/components/Tags';
import { Image } from '@/components/commons/Image';

import type { CharacterCardProps, BasicCardProps } from './interface';
import { GetElementPicture, ClassNameWithCSSModuleFactor } from '@/utils';

import Style from './index.module.less';
import { useConfig } from '@/stores/config';

const S = ClassNameWithCSSModuleFactor(Style, 'card-');
const C = ClassNameWithCSSModuleFactor(Style, 'character-');

const CharacterCard: FunctionalComponent<CharacterCardProps, any, any> = (props, ctx) => {
  const config = useConfig();
  return (
    <BasicCard
      class={C({
        'in-team': props.inTeam === true,
        'not-in-team': props.inTeam !== true
      })}
      type="character"
      {...(ctx.attrs as unknown as BasicCardProps)}
      imgUrl={`${config.character.baseUrl}${props.eName}/avatar.png`}
      selected={props.selected}
    >
      <img
        class={C('element')}
        draggable={false}
        src={GetElementPicture(props.element)}
        alt="element"
      />
    </BasicCard>
  );
};
// 处理透传
CharacterCard.props = ['selected','element', 'eName', 'inTeam'];

const BasicCard: FunctionalComponent<CardProps, {}, { default: any }> = (props, { slots }) => (
  <div
    class={S({
      outer: true,
      selected: props.selected ?? false
    })}
  >
    <div class={S(['photo-container', `photo-container-${RarityToColor(props.star)}`])}>
      <Image
        draggable={false}
        src={props.imgUrl}
        width="120"
      />
    </div>
    <div class={S('lvl')}>
      {props.type === 'artifact' ? '+' : 'Lv.'}
      {props.lvl}
    </div>

    <div class={S('mask')}>
      <div class={Style['star-offset']}>{slots.default()}</div>
      {props.type != 'character' && <Rarity rarity={props.star} />}
    </div>
  </div>
);
BasicCard.props = ['type', 'star', 'imgUrl', 'lvl', 'selected'];

export { CharacterCard, BasicCard };
