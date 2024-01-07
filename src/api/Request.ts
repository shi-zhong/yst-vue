import { Message } from '@shi-zhong/genshin-ui';

const publicUrl = '/api/v1';

export const tokenName = 'genshinTool';

interface Options {
  method?: string;
  headers?: Record<string, string>;
  token?: boolean;
  data?: object;
}

export const Cookie = {
  get(cname: string) {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let c of ca) {
      c = c.replace(' ', '');
      if (c.slice(0, cname.length + 1) === name) {
        return c.split('=')[1];
      }
    }
    return '';
  },
  set(cname: string, cvalue: string) {
    document.cookie = `${cname}=${cvalue};`;
  }
};

const Fetch = (url: string, options?: Options) => {
  const opt = {
    method: options?.method?.toUpperCase() || 'GET',
    headers: {
      Accept: 'application/json',
      token: Cookie.get(tokenName),
      ...(options?.headers || { 'Content-Type': 'application/json' })
    },
    body:
      options?.data instanceof FormData
        ? options.data
        : options?.data && JSON.stringify(options.data),
    token: options?.token && Cookie.get(tokenName)
  };

  return fetch(url, opt)
    .then(
      (res) => {
        switch (res.status) {
          case 200:
            return res.json();
          case 400:
            Message.error('请求体错误 400', 2000);
            break;
          case 404:
            Message.error('请求地址错误 404', 2000);
            break;
          default: {
            Message.error('网络错误或请求被阻止.', 2000);
          }
        }

        return { msg: 'fail.', code: res.status * 100, data: {} };
      },
      () => {
        Message.error('网络错误或请求被阻止.', 2000);
        return { msg: 'fail.', code: 50000, data: {} };
      }
    )
    .then((data) => {
      const { code, msg } = data;
      // 初步处理请求错误
      switch (Math.floor(code / 100)) {
        case 200:
          break;
        case 400:
          Message.error(`参数错误:${msg}:${url}`, 2000);
          break;
        case 403:
          Message.error(`权限错误:${msg}:${url}`, 2000);
          break;
        case 500:
          Message.error(`服务器错误:${msg}:${url}`, 2000);
          break;
        default: {
          Message.error(`其他错误:${msg}:${url}`, 2000);
        }
      }
      return data;
    });
};

export type GlobalResponseDataStruct<T = {}> = {
  code: number;
  msg: string;
  data: T;
};

const proxy = (method: string) => {
  return <T>(url: string, opts?: Options): Promise<GlobalResponseDataStruct<T>> => {
    const Opts = {
      token: true,
      method: method.toUpperCase(),
      ...opts
    };
    return Fetch(publicUrl + url, Opts);
  };
};

export const get = proxy('GET');
export const post = proxy('POST');
export const put = proxy('PUT');
export const del = proxy('DELETE');
