import { post, get, del } from './Request';
import type { WeaponTypeModel } from '@/components/Weapon';

export const WeaponTypeAdd = (data: WeaponTypeModel) =>
  post<{ id: number }>('/weapon/type/add', { data });

export const WeaponTypeGet = (data: number) =>
  get<{ weapons: WeaponTypeModel[] }>(`/weapon/type/${data}`);

export const WeaponTypeGetAll = () =>
  get<{ weapons: WeaponTypeModel[] }>('/weapon/type/all');

export const WeaponTypeDel = (data: number) => del(`/weapon/type/del/${data}`);

export const WeaponTypeModify = (id: number, data: WeaponTypeModel) =>
  post<{ id: number }>(`/weapon/type/modify/${id}`, {
    data
  });
