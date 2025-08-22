export interface ICustomButtonProps {
  active?: boolean;
  navigateTo: string;
  children?: string;
  submitFunc?: () => void;
}
