export type Referrer = {
  url: string;
  policy: string;
};

export type Tab = {
  id: string;
  title: string;
  url: string;
  pinned: boolean;
  basecamp: boolean;
  sleeping: boolean;
  muted: boolean;
  hasSound: boolean;
  playing: boolean;
  findActive: boolean;
  findText: string;
  findMatches: number;
  findActiveMatch: number;
};

export type Space = {
  id: string;
  name: string;
  icon: string;
};

export type TabsState = {
  activeId: string | null;
  tabs: Tab[];
  spaces: Space[];
  spaceId: string;
  splits: SplitGroup[];
};

export type SplitGroup = {
  id: string;
  tabIds: [string, string] | [string, string, string];
  sizes: number[];
};

export type NavState = {
  canBack: boolean;
  canForward: boolean;
  url: string;
  isLoading: boolean;
};

export type NavCommand = { type: 'back' } | { type: 'forward' } | { type: 'reload' };

export type FindResult = {
  requestId: number;
  activeMatchOrdinal: number;
  matches: number;
  finalUpdate: boolean;
};

export type SavedTab = unknown;
export type SavedHistory = unknown;
export type ArchivedTab = unknown;
export type ClosedTab = unknown;
export type ClosedPin = unknown;
export type PlayerState = unknown;
