import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mullion', {
  tabs: {
    list: () => ipcRenderer.invoke('tabs:list'),
    activate: (id: string) => ipcRenderer.invoke('tabs:activate', id),
    new: (url?: string) => ipcRenderer.invoke('tabs:new', url),
    close: (id: string) => ipcRenderer.invoke('tabs:close', id),
    navigate: (id: string, url: string) => ipcRenderer.invoke('tabs:navigate', id, url),
    back: (id: string) => ipcRenderer.invoke('tabs:back', id),
    forward: (id: string) => ipcRenderer.invoke('tabs:forward', id),
    reload: (id: string) => ipcRenderer.invoke('tabs:reload', id),
  },
  nav: {
    subscribe: (cb: (state: any) => void) => {
      const handler = (_e: any, state: any) => cb(state);
      ipcRenderer.on('nav:changed', handler);
      return () => ipcRenderer.removeListener('nav:changed', handler);
    },
  },
  on: (channel: string, cb: (...args: any[]) => void) => {
    const handler = (_e: any, ...args: any[]) => cb(...args);
    ipcRenderer.on(channel, handler);
    return () => ipcRenderer.removeListener(channel, handler);
  },
});
