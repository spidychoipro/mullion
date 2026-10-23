# Mullion

Windows용 Arc 스타일 브라우저. 오픈소스.

Arc가 macOS 전용으로 가면서 윈도우에는 진짜 대안이 사라졌다. Mullion은 그 빈자리를 채우기 위해 시작한 프로젝트다.

이름은 창문에서 유리 조각과 조각 사이를 나누는 세로 기둥 **mullion**에서 따왔다. 창문을 칸으로 나누듯, 탭을 공간과 분할 뷰로 나눠 쓰는 브라우저라는 뜻을 담았다.

## 핵심 아이디어

- **윈도우에 최적화된 Arc UX** - 세로 사이드바, 스페이스, 분할 뷰, 커맨드바
- **엔진 교체 가능** - Chromium(Electron/CEF)과 Gecko를 자유롭게 선택. 최종적으로는 탭마다 다른 엔진도 사용 가능하게 할 예정
- **로컬 우선** - 계정, 동기화, 클라우드에 의존하지 않고 로컬에서 모든 게 동작
- **오픈소스** - 투명하게, 필요한 사람 누구나 고칠 수 있게

## 기술 스택

- [Electron](https://www.electronjs.org/) + [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- 셸과 웹 엔진을 분리한 어댑터 구조([`docs/architecture.md`](docs/architecture.md))

## 상태

**초기 스캐폴드 단계**

기본적인 창 구조와 탭 전환, 주소창, 사이드바 UI만 갖춰진 상태다. 아직은 프로토타입 수준이다.

## 개발

```bash
npm install
npm start
```

## 라이선스

[MIT](LICENSE)

> Mullion은 The Browser Company나 Arc 브라우저와 **무관한** 독립 프로젝트다.
