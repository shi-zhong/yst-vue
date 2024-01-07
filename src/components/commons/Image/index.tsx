import type { FunctionalComponent } from 'vue';

interface ImageProps {
  src?: string;
  draggable?: boolean;
  width?: string | number;
}

export const ImageSrc = (src?: string) => {
  if (src === undefined) {
    return '';
  } else if (src.startsWith('data:image') || src.startsWith('/src/assets')) {
    return src;
  } else {
    return 'http://localhost:8000' + src;
  }
};

export const Image: FunctionalComponent<ImageProps, any, any> = (props: ImageProps) => {
  const { src, draggable, width } = props;
  return (
    <img
      src={ImageSrc(src)}
      draggable={draggable}
      width={width}
    />
  );
};

Image.props = ['src', 'draggable', 'width'];



