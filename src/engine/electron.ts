import { session, WebContentsView, type WebContents } from 'electron';
import type { Page, PageBounds, PageContextMenu, PageEngine, PageEvents, Referrer } from './engine';

type ListenerMap = {
  [K in keyof PageEvents]: Set<PageEvents[K]>;
};

class ElectronPage implements Page {
  id: string;
  webContentsId: number;
  view: WebContentsView;
  private listeners: ListenerMap = {
    title: new Set(),
    favicon: new Set(),
    navigated: new Set(),
    load: new Set(),
    loadCommit: new Set(),
    didNavigate: new Set(),
    setHistoryState: new Set(),
    contextMenu: new Set(),
    newWindow: new Set(),
    login: new Set(),
    crashed: new Set(),
    unresponsive: new Set(),
    responsive: new Set(),
    close: new Set(),
  };

  constructor(id: string, view: WebContentsView) {
    this.id = id;
    this.view = view;
    this.webContentsId = view.webContents.id;
    this.bind();
  }

  private bind() {
    const wc = this.view.webContents;

    wc.on('page-title-updated', (_e, title) => this.emit('title', title));
    wc.on('page-favicon-updated', (_e, favicons) => {
      if (favicons[0]) this.emit('favicon', favicons[0]);
    });
    wc.on('did-navigate', (_e, url) => {
      this.emit('navigated', url, true);
      this.emit('didNavigate', url);
    });
    wc.on('did-navigate-in-page', (_e, url, isMainFrame) => {
      if (isMainFrame) {
        this.emit('navigated', url, true);
        this.emit('didNavigate', url);
      } else {
        this.emit('navigated', url, false);
      }
    });
    wc.on('dom-ready', () => this.emit('load'));
    wc.on('did-commit-navigation', (_e, url) => this.emit('loadCommit', url));
    wc.on('did-start-loading', () => {});
    wc.on('did-stop-loading', () => {});
    wc.on('update-target-url', () => {});
    wc.on('context-menu', (_e, params) => {
      const menu: PageContextMenu = {
        x: params.x,
        y: params.y,
        linkURL: params.linkURL || undefined,
        linkText: params.linkText || undefined,
        srcURL: params.srcURL || undefined,
        mediaType: params.mediaType as PageContextMenu['mediaType'],
        editFlags: params.editFlags,
      };
      this.emit('contextMenu', menu);
    });
    wc.setWindowOpenHandler((details) => {
      const referrer: Referrer = { url: details.referrer.url || '', policy: details.referrer.policy };
      this.emit('newWindow', details.url, details.disposition, referrer);
      return { action: 'deny' };
    });
    wc.on('login', (_e, _authInfo, cb) => {
      // UI handles this via ipc; emit placeholder
      cb('');
    });
    wc.on('crashed', () => this.emit('crashed'));
    wc.on('unresponsive', () => this.emit('unresponsive'));
    wc.on('responsive', () => this.emit('responsive'));
  }

  on<K extends keyof PageEvents>(event: K, listener: PageEvents[K]) {
    this.listeners[event].add(listener);
  }
  off<K extends keyof PageEvents>(event: K, listener: PageEvents[K]) {
    this.listeners[event].delete(listener);
  }
  private emit<K extends keyof PageEvents>(event: K, ...args: Parameters<PageEvents[K]>) {
    for (const l of this.listeners[event]) {
      (l as (...a: unknown[]) => void)(...args);
    }
  }

  navigate(url: string, referrer?: Referrer, postBody?: unknown) {
    if (postBody) {
      // keep simple for now
      this.view.webContents.loadURL(url);
      return;
    }
    const options: Electron.LoadURLOptions = {};
    if (referrer?.url) {
      options.httpReferrer = referrer.url;
    }
    this.view.webContents.loadURL(url, options);
  }
  goBack() { return this.view.webContents.canGoBack() ? (this.view.webContents.goBack(), true) : false; }
  goForward() { return this.view.webContents.canGoForward() ? (this.view.webContents.goForward(), true) : false; }
  reload() { this.view.webContents.reload(); }
  stop() { this.view.webContents.stop(); }
  setBounds(bounds: PageBounds) { this.view.setBounds(bounds); }
  focus() { this.view.webContents.focus(); }
  blur() { this.view.webContents.blur(); }
  setZoomFactor(factor: number) { this.view.webContents.setZoomFactor(factor); }
  getZoomFactor() { return this.view.webContents.getZoomFactor(); }
  setAudioMuted(muted: boolean) { this.view.webContents.setAudioMuted(muted); }
  isAudioMuted() { return this.view.webContents.isAudioMuted(); }
  executeJavaScript(code: string) { return this.view.webContents.executeJavaScript(code); }
  findInPage(text: string, options?: { forward?: boolean; matchCase?: boolean }) {
    this.view.webContents.findInPage(text, options as never);
  }
  stopFindInPage(action: 'clearSelection' | 'keepSelection' | 'activateSelection' = 'clearSelection') {
    this.view.webContents.stopFindInPage(action);
  }
  destroy() {
    try { this.view.webContents.close(); } catch {}
  }
}

export class ElectronEngine implements PageEngine {
  setPageAudioMuted(muted: boolean) {
    // global mute not used
  }
  createPage(options?: { partition?: string; userAgent?: string; referrer?: Referrer }): Page {
    const ses = options?.partition ? session.fromPartition(options.partition) : session.defaultSession;
    const view = new WebContentsView({
      webPreferences: {
        sandbox: true,
        nodeIntegration: false,
        contextIsolation: true,
        session: ses,
      },
    });
    if (options?.userAgent) {
      view.webContents.setUserAgent(options.userAgent);
    }
    const id = Math.random().toString(36).slice(2);
    return new ElectronPage(id, view);
  }
}
