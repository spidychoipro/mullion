import React, { useEffect, useState } from 'react';

type Tab = { id: string; url: string; title: string };
type NavState = { canBack: boolean; canForward: boolean; url: string; isLoading: boolean };

declare global {
  interface Window {
    mullion: any;
  }
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [nav, setNav] = useState<NavState>({ canBack: false, canForward: false, url: '', isLoading: false });
  const [addr, setAddr] = useState('');

  async function refresh() {
    const list = await window.mullion.tabs.list();
    setTabs(list);
    if (!active && list[0]) setActive(list[0].id);
  }

  useEffect(() => {
    refresh();
    const off = window.mullion.nav.subscribe((s: NavState) => {
      setNav(s);
      setAddr(s.url);
      refresh();
    });
    return off;
  }, []);

  function go() {
    if (!active) return;
    let url = addr.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      if (url.includes('.') && !url.includes(' ')) url = 'https://' + url;
      else url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
    }
    window.mullion.tabs.navigate(active, url);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="spaces">
          <button className="space active">1</button>
          <button className="space">2</button>
          <button className="space">+</button>
        </div>
        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={'tab ' + (t.id === active ? 'active' : '')}
              onClick={() => {
                setActive(t.id);
                window.mullion.tabs.activate(t.id);
              }}
            >
              <span className="title">{t.title || t.url || 'New Tab'}</span>
              <span className="close" onClick={(e) => { e.stopPropagation(); window.mullion.tabs.close(t.id); refresh(); }}>×</span>
            </button>
          ))}
          <button className="tab" onClick={() => window.mullion.tabs.new().then(refresh)}>+ 새 탭</button>
        </div>
      </aside>
      <header className="topbar">
        <div className="nav">
          <button onClick={() => active && window.mullion.tabs.back(active)} disabled={!nav.canBack}>←</button>
          <button onClick={() => active && window.mullion.tabs.forward(active)} disabled={!nav.canForward}>→</button>
          <button onClick={() => active && window.mullion.tabs.reload(active)}>↻</button>
        </div>
        <input
          className="address"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          spellCheck={false}
        />
      </header>
      <main className="content" />
    </div>
  );
}
