import type { Referrer } from '../types';

export interface PageContextMenu {
  x: number;
  y: number;
  linkURL?: string;
  linkText?: string;
  srcURL?: string;
  mediaType?: 'image' | 'video' | 'audio';
  editFlags?: {
    canUndo: boolean;
    canRedo: boolean;
    canCut: boolean;
    canCopy: boolean;
    canPaste: boolean;
    canSelectAll: boolean;
  };
}

export interface PageBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageEvents {
  title: (title: string) => void;
  favicon: (favicon: string) => void;
  navigated: (url: string, isMainFrame: boolean) => void;
  load: () => void;
  loadCommit: (url: string) => void;
  didNavigate: (url: string) => void;
  setHistoryState: () => void;
  contextMenu: (menu: PageContextMenu) => void;
  newWindow: (
    url: string,
    disposition: string,
    referrer: Referrer,
    postBody?: unknown,
  ) => void;
  login: (username: string, password: string) => void;
  crashed: () => void;
  unresponsive: () => void;
  responsive: () => void;
  close: () => void;
}

export interface Page {
  id: string;
  webContentsId: number;
  on<K extends keyof PageEvents>(event: K, listener: PageEvents[K]): void;
  off<K extends keyof PageEvents>(event: K, listener: PageEvents[K]): void;
  navigate(url: string, referrer?: Referrer, postBody?: unknown): void;
  goBack(): boolean;
  goForward(): boolean;
  reload(): void;
  stop(): void;
  setBounds(bounds: PageBounds): void;
  focus(): void;
  blur(): void;
  setZoomFactor(factor: number): void;
  getZoomFactor(): number;
  setAudioMuted(muted: boolean): void;
  isAudioMuted(): boolean;
  executeJavaScript(code: string): Promise<unknown>;
  findInPage(
    text: string,
    options?: { forward?: boolean; matchCase?: boolean },
  ): void;
  stopFindInPage(action?: 'clearSelection' | 'keepSelection' | 'activateSelection'): void;
  destroy(): void;
}

export interface PageEngine {
  createPage(options?: {
    partition?: string;
    userAgent?: string;
    referrer?: Referrer;
  }): Page;
  setPageAudioMuted(muted: boolean): void;
}

export type EngineKind = 'chromium' | 'gecko';

export interface EngineAdapter {
  kind: EngineKind;
  engine: PageEngine;
  attach(page: Page, bounds: PageBounds): void;
  detach(page: Page): void;
}
