export type ModuleId = 'inflation' | 'interest' | 'central-bank';

export type ModuleMeta = {
  id: ModuleId;
  title: string;
  description: string;
  minutes: number;
};
