export type SearchProps = {
  autoFocus?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  fake?: boolean;
  onSubmitEditing?: () => void;
  placeholder?: string;
};
