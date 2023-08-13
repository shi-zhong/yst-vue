import FoldingCharacterDrawer from './components/FoldingCharacterDrawer/index.vue';
import ExpandCharacterList from './components/ExpandCharacterList/index.vue';
import Filter from './components/ExpandCharacterList/Filter.vue';

import Talents from './components/Talents/index.vue';
import Constellation from './components/Constellation/index.vue';

export const SidebarComponents = {
  folding: FoldingCharacterDrawer,
  expand: ExpandCharacterList,
  filter: Filter,
  talents: Talents,
  life: Constellation
};

export type SidebarNames = keyof typeof SidebarComponents | 'filter' | 'story';