import type { WeaponTypes } from '@/components/Weapon';
import { get, post, Cookie, tokenName } from './Request';
import { type ArtifactSlots } from '@/components/Artifact';
import { Message } from '@shi-zhong/genshin-ui';

type ConfigMapper = {
  character: {
    base: number;
    baseUrl: string;
  };
  artifact: {
    base: number;
    baseUrl: string;
    slots: Record<ArtifactSlots, number>;
  };
  weapon: {
    base: number;
    baseUrl: string;
    types: Record<WeaponTypes, number>;
  };
};

export const requestConfig = () => get<ConfigMapper>('/config');

export const UploadImg = (formData: FormData) =>
  post<{ url: string }>('/upload/img', {
    data: formData,
    headers: {}
  });

export const Login = () =>
  post<{ token: string }>('/auth/login', {
    data: {
      uid: '199124377',
      pwd: '236519847'
    }
  }).then((data) => {
    if (data.code === 20000) {
      Message.success('获取成功')
      Cookie.set(tokenName, data.data.token);
    }
  });
