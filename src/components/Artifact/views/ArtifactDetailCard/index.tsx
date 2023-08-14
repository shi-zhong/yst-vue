import { Lock, Enable } from '@/components/Tags';
import { BasicDetailCard, BasicDetailCardProps } from '@/components/DetailCard';
import { ClassNameWithCSSModuleFactor } from '@/utils/className';
import {
  ArtifactInstanceModel,
  ArtifactSlot,
  ArtifactSuitModel,
} from '../../interfaces';

import { useEffect, useState } from 'react';
import { GetArtifactSlot, GetArtifactTypeChinese } from '../../functions';
import ArtifactStyle from './index.less';

interface ArtifactDetailCardProps extends BasicDetailCardProps {
  id: number;
  artifact: ArtifactSuitModel;
  type: ArtifactSlot;
  lock: boolean;
  suitCount: 0 | 1 | 2 | 3 | 4 | 5;
  lvl: number;
  subs: {
    key: string;
    value: string;
    [key: string]: any;
  }[];
}

const ArtifactDetailCard = (props: ArtifactDetailCardProps) => {
  const prefix = 'artifact-detail-card-';
  const { id, subs, artifact, type, suitCount } = props;

  const [slot, setSlot] = useState({ name: '', imgUrl: '', describe: '' } as {
    name: string;
    imgUrl: string;
    describe: string;
  });

  const Style = ClassNameWithCSSModuleFactor(ArtifactStyle, prefix);

  useEffect(() => {
    setSlot(GetArtifactSlot(artifact, type));
  }, []);

  return (
    <BasicDetailCard
      {...props}
      imgUrl={slot.imgUrl}
      title={slot.name}
      type={GetArtifactTypeChinese(type)}
    >
      <div className={Style(['describe'])}>
        <div className={Style(['lvl-container'])}>
          <div className={Style(['lvl'])}>+{props.lvl}</div>
          <Lock size={30} lock={props.lock} />
        </div>
        <div className={Style(['attributes'])}>
          {subs.map((i) => (
            <div key={i.key + i.value}>
              {' · '}
              {i.key}+{i.value}
            </div>
          ))}
        </div>
        <div className={Style(['describe-enable'])}>{artifact.name}:</div>
        <div className={Style(['effect-box'])}>
          {artifact.effects.map((i) => (
            <div key={i.limit} style={{ overflow: 'hidden' }}>
              <Enable
                size={20}
                enable={i.limit <= suitCount}
                style={{ float: 'left' }}
              />
              <div
                className={Style({
                  'describe-enable': i.limit <= suitCount,
                  effect: true,
                })}
              >
                {i.limit}件套：{i.describe}
              </div>
            </div>
          ))}
        </div>
        <div>{slot.describe}</div>
      </div>
    </BasicDetailCard>
  );
};

export { ArtifactDetailCardProps };
export { ArtifactDetailCard };
