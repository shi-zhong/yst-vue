import type { CharacterModel } from '@/interface';
import { get, post } from './Request';

export const CharacterTypeUpdate = (data: CharacterModel) => {
  return post<{ id: number }>('/character/type/update', { data });
};

export const CharacterTypeQuery = (id?: number) => {
  return get<{
    character_static: CharacterModel[];
  }>(`/character/type/query${id !== undefined ? `?id=${id}` : ''}`);
};

export const CharacterTypeImage = (name: string) => {
  return post(`/character/type/image/${name}`);
};

export const CharacterTypeClean = (name: string) => {
  return post(`/character/type/image/clean/${name}`);
};
