const publicUrl = '/api/v1';

interface Options {
  method?: string;
  headers?: Record<string, string>;
  token?: boolean;
  data?: object;
}

const Cookie = {
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
    headers: options?.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: Cookie.get('genshinTool')
    },
    body: options?.data && JSON.stringify(options.data),
    token: options?.token && Cookie.get('genshinTool')
  };

  return fetch(url, opt).then(
    (res) => {
      if (res.status === 200) return res.json();
      else return { msg: 'fail.' };
    },
    () => ({ msg: 'fail.' })
  );
};

export const Upload = (formData: FormData): Promise<GlobalResponseDataStruct<{ url: string }>> => {
  const opt = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'multipart/form-data',
      token: Cookie.get('genshinTool')
    },
    body: formData,
    token: Cookie.get('genshinTool')
  };

  return fetch(publicUrl + '/upload', opt).then((res) => {
    return res.json();
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
export interface response {
  code: number;
  message: string;
}
export interface responseWithData {
  code: number;
  message: string;
  data: Record<string, any>;
}

export default Cookie;
