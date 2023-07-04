import { ClassNameWithCSSModuleFactor } from '@/utils/className';
import { ButtonShrink, ButtonWrap } from '@/components';
import TalentA from '@/assets/skills/yoimiya/talent_4.png';
import { ScrollView } from '@/components';
import { ConstellationIcon } from '@/pages/character/components/ContentRight/components/Constellation';
import { Line } from '@/components';
import { HighLight } from '@/components/HighLight';
import ConstellationStyle from './index.less';

interface ConstellationProps {}

const Style = ClassNameWithCSSModuleFactor(
  ConstellationStyle,
  'constellation-',
);

const Talent = {
  title: '出预留金',
  index: 3,
  icon: TalentA,
  name: '普通攻击·烟火打杨',
  lvl: 9,
};

const Index = (props: ConstellationProps) => {
  return (
    <div className={Style()}>
      <div className={Style('basic')}>
        <ConstellationIcon
          element={'fire'}
          lock={false}
          // lock
          icon={TalentA}
        />
      </div>
      <Line />
      <ScrollView className={Style('tab-item')} slide>
        <div className={Style('content')}>
          <div className={Style('title')}>出预留金</div>
          <div className={Style('sub-title')}>
            命之座 第<span className={Style('number')}> {1} </span>层
          </div>
          <div
            className={Style({
              lock: true,
            })}
          >
            <HighLight text={`$0琉金云间草$的鎏金火花持续时间延长至4秒。`} />
          </div>
        </div>
      </ScrollView>
      <Line />
      <div className={Style('button-box')}>
        <div className={Style('button-con')}>
          <ButtonShrink text="激活" special="round" />
        </div>
      </div>
    </div>
  );
};

export { Index as Constellation, ConstellationProps };
export default Index;
