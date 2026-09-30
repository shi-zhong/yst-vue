import type { WeaponsCode, ArtifactSlotsCode } from '@shi-zhong/genshin-ui';

import { get, post, Cookie, tokenName } from './Request';

import { Message } from '@shi-zhong/genshin-ui';

type ConfigMapper = {
  character: {
    base: number;
    baseUrl: string;
  };
  artifact: {
    base: number;
    baseUrl: string;
    slots: Record<ArtifactSlotsCode, number>;
  };
  weapon: {
    base: number;
    baseUrl: string;
    types: Record<WeaponsCode, number>;
  };
};

export const requestConfig = () => get<ConfigMapper>('/config');

export const UploadImg = (formData: FormData, opt?: { dir?: string; hash?: string }) =>
  post<{ url: string }>('/upload/img', {
    data: formData,
    headers: {},
    query: opt
  });

export const Login = () =>
  post<{ token: string }>('/auth/login', {
    data: {
      uid: '199124377',
      pwd: '236519847'
    }
  }).then((data) => {
    if (data.code === 20000) {
      Message.success('获取成功');
      Cookie.set(tokenName, data.data.token);
    }
  });
