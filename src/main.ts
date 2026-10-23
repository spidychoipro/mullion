import { app, BrowserWindow, ipcMain, WebContentsView } from 'electron';
import path from 'node:path';
import { ElectronEngine } from './engine/electron';
import type { NavState } from './types';

const engine = new ElectronEngine();
let win: BrowserWindow | null = null;

const tabs = new Map<string, { view: WebContentsView; url: string }>();
let activeId: string | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  win.on('closed', () => {
    win = null;
  });
}

function layout() {
  if (!win) return;
  const { width, height } = win.getContentBounds();
  // sidebar ~280px, topbar ~52px rough
  const sidebar = 280;
  const top = 52;
  for (const [id, t] of tabs) {
    t.view.setBounds({
      x: sidebar,
      y: top,
      width: Math.max(200, width - sidebar),
      height: Math.max(200, height - top),
    });
  }
}

function attachView(id: string, view: WebContentsView) {
  if (!win) return;
  // add to window
  // @ts-ignore
  win.contentView.addChildView(view);
  layout();
}

function newTab(url = 'https://www.google.com') {
  const page = engine.createPage();
  const id = Math.random().toString(36).slice(2);
  // @ts-ignore
  const view = (page as any).view as WebContentsView;
  tabs.set(id, { view, url });
  attachView(id, view);
  setActive(id);
  view.webContents.loadURL(url);
  view.webContents.on('did-navigate', (_e, u) => {
    const t = tabs.get(id);
    if (t) t.url = u;
    pushNav();
  });
  view.webContents.on('page-title-updated', pushNav);
  pushNav();
  return id;
}

function setActive(id: string) {
  activeId = id;
  for (const [tid, t] of tabs) {
    if (tid === activeId) {
      t.view.webContents.setAudioMuted(false);
      t.view.setVisible(true);
    } else {
      t.view.setVisible(false);
    }
  }
  pushNav();
}

function pushNav() {
  if (!win || !activeId) return;
  const t = tabs.get(activeId);
  if (!t) return;
  const wc = t.view.webContents;
  const state: NavState = {
    canBack: wc.canGoBack(),
    canForward: wc.canGoForward(),
    url: wc.getURL(),
    isLoading: wc.isLoading(),
  };
  win.webContents.send('nav:changed', state);
}

app.on('ready', () => {
  createWindow();
  if (tabs.size === 0) newTab();
  win?.on('resize', layout);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('tabs:new', (_e, url?: string) => {
  return newTab(url);
});
ipcMain.handle('tabs:activate', (_e, id: string) => {
  setActive(id);
  return true;
});
ipcMain.handle('tabs:close', (_e, id: string) => {
  const t = tabs.get(id);
  if (!t) return;
  // @ts-ignore
  win?.contentView.removeChildView(t.view);
  try { t.view.webContents.close(); } catch {}
  tabs.delete(id);
  if (activeId === id) {
    const next = Array.from(tabs.keys())[0] ?? null;
    if (next) setActive(next);
    else if (win) { activeId = null; pushNav(); }
  }
  return true;
});
ipcMain.handle('tabs:navigate', (_e, id: string, url: string) => {
  const t = tabs.get(id);
  if (!t) return;
  t.url = url;
  t.view.webContents.loadURL(url);
});
ipcMain.handle('tabs:back', (_e, id: string) => {
  const t = tabs.get(id);
  if (t?.view.webContents.canGoBack()) t.view.webContents.goBack();
});
ipcMain.handle('tabs:forward', (_e, id: string) => {
  const t = tabs.get(id);
  if (t?.view.webContents.canGoForward()) t.view.webContents.goForward();
});
ipcMain.handle('tabs:reload', (_e, id: string) => {
  const t = tabs.get(id);
  if (t) t.view.webContents.reload();
});
ipcMain.handle('tabs:list', () => {
  const list = [];
  for (const [id, t] of tabs) {
    list.push({ id, url: t.view.webContents.getURL(), title: t.view.webContents.getTitle() });
  }
  return list;
});
