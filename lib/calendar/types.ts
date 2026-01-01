export type BlockType = "work" | "rest";

export type Block = {
  type: BlockType;
  cycleNumber: number;
  weekInCycle: number;
  start: Date;
  end: Date;
};

export type CycleConfig = {
  cycleStartDate: Date;
  workWeeks: number;
  restWeeks: number;
  weekStartsOn: WeekStartDay;
};

export type WeekStartDay = 0 | 1; // 0 = Sunday, 1 = Monday

export type FilterOptions = {
  blockType?: BlockType | "all";
  cycleNumber?: number;
};

export type MonthRange = {
  month: string;
  startIndex: number;
  width: number;
};

export type CycleLabels = Record<number, string>;

export type ViewMode = "timeline" | "month" | "agenda";

export type CycleLabelChangeHandler = (cycleNumber: number, label: string) => void;

