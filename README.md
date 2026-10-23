# Mullion

**Windows용 오픈소스 Arc 대안 브라우저**

Arc가 더 이상 윈도우를 지원하지 않게 되면서, 윈도우 사용자를 위한 진짜 대안이 필요해졌다. Mullion은 Arc의 정체성인 *작업 공간 기반 브라우징*을 Windows에 가져오고, 더 나아가 원하는 엔진으로 자유롭게 바꿔 쓸 수 있게 만든다.

> 이름은 창문을 칸으로 나누는 세로 기둥인 *mullion*에서 따왔다. 하나의 창을 여러 개의 공간과 분할 뷰로 효율적으로 나눠 쓰는 아이디어를 담고 있다.

## Why Mullion?

- **Arc 감성 그대로** – 세로 사이드바, 스페이스(Space), 분할 뷰(Split View), 커맨드바(Command Bar)
- **엔진 스왑 가능한 구조** – Chromium과 Gecko를 셸과 분리된 어댑터로 연결. 탭마다 다른 엔진을 사용하는 게 최종 목표
- **Windows 우선** – Arc의 빈자리를 가장 실용적으로 채우기 위해 Windows에 초점을 맞춤
- **로컬 우선** – 계정, 동기화, 추적 없는 순수한 로컬 브라우징
- **오픈소스 (MIT)** – 누구나 보고, 고치고, 기여할 수 있음

## Features

- [ ] 세로 사이드바 탭
- [ ] 스페이스
- [ ] 분할 뷰
- [ ] 커맨드바
- [ ] 북마크/히스토리
- [ ] 확장 프로그램 (Chrome 확장 호환)
- [ ] 엔진 교체 (Chromium ↔ Gecko)
- [ ] 탭별 엔진 선택

## Architecture

Mullion은 **브라우저 셸(Shell)** 과 **웹 엔진(Adapter)** 을 명확히 분리한다.

```text
┌─────────────┐
│   Shell     │  UI, 탭, 스페이스, 분할 뷰, 커맨드바
├─────────────┤
│ Engine API  │  추상화된 인터페이스
├─────┬───────┤
│ CEF │ Gecko │  실제 엔진 어댑터
└─────┴───────┘
```

자세한 내용은 [`docs/architecture.md`](docs/architecture.md)를 참고한다.

## Tech Stack

| 구분 | 기술 |
| --- | --- |
| 프레임워크 | [Electron](https://www.electronjs.org/) 44 |
| 번들러 | [Vite](https://vitejs.dev/) 8 + [Electron Forge](https://www.electronforge.io/) |
| UI | [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/) 6 |
| 엔진 | Chromium (기본) / Gecko (계획) |

## Getting Started

### 개발 환경 실행

```bash
# 클론
git clone https://github.com/spidychoipro/mullion.git
cd mullion

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 빌드

```bash
npm run package  # 패키징
npm run make      # 설치 파일 생성
```

## Roadmap

- [x] 프로젝트 스캐폴드
- [x] 엔진 어댑터 구조 설계
- [x] 기본 UI 틀 (사이드바/탑바/탭)
- [ ] 탭 레이아웃 및 WebContentsView 정교화
- [ ] 스페이스 시스템
- [ ] 분할 뷰
- [ ] 커맨드바
- [ ] 엔진 어댑터 구현 (CEF 실험)
- [ ] Gecko 임베딩 스파이크

## Contributing

기여는 언제나 환영한다. 이슈나 PR을 자유롭게 열어주면 된다.

## Disclaimer

Mullion은 The Browser Company 및 Arc 브라우저와 **어떠한 연관도 없는 독립 프로젝트**다.

## License

[MIT License](LICENSE) © 2026 spidychoipro
