import type { ArtifactSuitModel } from '@/components/Artifact';
import { post, get, del } from './Request';

export const ArtifactSuitAdd = (data: ArtifactSuitModel) =>
  post<{ id: number }>('/artifact/suit/add', { data });

export const ArtifactSuitGet = (data: number) =>
  get<{ artifacts: ArtifactSuitModel[] }>(`/artifact/suit/${data}`);

export const ArtifactSuitGetAll = () =>
  get<{ artifacts: ArtifactSuitModel[] }>('/artifact/suit/all');

export const ArtifactSuitDel = (data: number) => del(`/artifact/suit/del/${data}`);

export const ArtifactSuitModify = (id: number, data: ArtifactSuitModel) =>
  post<{ id: number }>(`/artifact/suit/modify/${id}`, {
    data
  });
