import FoldingCharacterDrawer from './components/FoldingCharacterDrawer/index.vue';
import ExpandCharacterList from './components/ExpandCharacterList/index.vue';
import Talents from './components/Talents/index.vue';
import Constellation from './components/Constellation/index.vue';

export const SidebarComponents = {
  folding: FoldingCharacterDrawer,
  expand: ExpandCharacterList,
  talents: Talents,
  life: Constellation
};

export type SidebarNames = keyof typeof SidebarComponents;