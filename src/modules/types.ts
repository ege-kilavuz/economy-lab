export type ModuleId = 'inflation' | 'interest' | 'central-bank' | 'life-sim';

export type ModuleMeta = {
  id: ModuleId;
  title: string;
  description: string;
  minutes: number;
};
