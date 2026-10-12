import { BaseBlockConfig, ContentBlock } from '@/lib/cms/blockSchemas';

export interface BlockEditorProps<TConfig extends BaseBlockConfig = BaseBlockConfig> {
  block: ContentBlock;
  config: TConfig;
  onUpdate: (updates: Partial<TConfig>) => void;
  openMediaPicker?: (targetField: string) => void;
  locale?: string;
}
