import BasicAttr from './components/BasicData/BasicData.vue';
import Constellation from './components/Constellation.vue';
import Talents from './components/Talents.vue';
import Artifact from './components/Artifact.vue';

export const ContentRightComponents = {
  attr: BasicAttr,
  artifact: Artifact,
  talents: Talents,
  life: Constellation
};

export type ContentRightNames = keyof typeof ContentRightComponents;
