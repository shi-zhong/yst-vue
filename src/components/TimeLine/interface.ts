export type TimeLineItemP = TimeLineItemAbs | TimeLineItemRela;

type TimeLineCommon = {
  id: number;
  start: number;
  last: number;
  payload: ThumbPayload;
  dep: Set<number>;
};

export type ThumbPayload = { popover?: (thumb: Thumb) => JSX.Element; [k: string]: any };

export type TimeLineItemAbs = TimeLineCommon & {
  type: 'abs';
};

export type TimeLineItemRela = TimeLineCommon & {
  type: 'rela';
  target: number;
  offset: number;
  direct: 'before' | 'after';
};

export interface BuildTimeLine {
  trackColor: TimeLineTrackColor;
  thumbColor: TimeLineThumbColor;
  groups: Group[];
}

export interface Group {
  id: number;
  name: string;
  weight: number;
  payload: object;
  thumbs: Thumb[][];
  trackColor?: TimeLineGroupTrackColor;
  thumbColor?: TimeLineGroupThumbColor;
}

export interface Thumb {
  id: number;
  order: number;
  start: number;
  last: number;
  space: number;
  payload?: ThumbPayload;
}

export type TimeLineTrackColor =
  | string
  | (<T = object>(groupIndex: number, trackIndex: number, payload: T) => string);

export type TimeLineGroupTrackColor =
  | string
  | (<T = object>(trackIndex: number, payload: T) => string);

export type TimeLineThumbColor =
  | string
  | (<T = object>(
      groupIndex: number,
      trackIndex: number,
      thumbIndex: number,
      payload: T
    ) => string);

export type TimeLineGroupThumbColor =
  | string
  | (<T = object>(trackIndex: number, thumbIndex: number, payload: T) => string);
