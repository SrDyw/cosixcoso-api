export interface PictureProps {
  url: string;
  size: number;
  children?: React.ReactNode;
  className?: string;
  animation?: {
    initialRotation:number;
    targetRotation: number;
  };
}
