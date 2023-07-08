import BasicAttr from './components/BasicData.vue';
import Constellation from './components/Constellation.vue';
import Talents from './components/Talents.vue';

export const ContentRightComponents = {
  attr: BasicAttr,
  talents: Talents,
  life: Constellation
};

export type ContentRightNames = keyof typeof ContentRightComponents;

