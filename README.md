# 🎉 Bingo Game Project 🎉

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) 
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

## 🌟 프로젝트 개요

이 프로젝트는 **실시간**으로 여러 플레이어가 함께 즐길 수 있는 온라인 빙고 게임 애플리케이션을 만드는 것을 목표로 합니다. 플레이어는 각자 방을 생성하고, 다른 플레이어들과 함께 빙고 게임을 즐길 수 있습니다. 이 프로젝트는 웹 소켓을 이용한 실시간 통신과 상태 관리를 포함하고 있습니다.

### 🎯 목표
이 프로젝트는 **실시간**으로 여러 플레이어가 함께 즐길 수 있는 온라인 빙고 게임 애플리케이션을 만드는 것을 목표로 합니다.<br>
플레이어는 각자 방을 생성하고, 다른 플레이어들과 함께 빙고 게임을 즐길 수 있습니다. 이 프로젝트는 웹 소켓을 이용한 실시간 통신과 상태 관리를 포함하고 있습니다.

### 🛠️ 기술 스택

- **프론트엔드**: React, Material-UI
- **백엔드**: Node.js, Express
- **실시간 통신**: Socket.IO

## 🚀 주요 기능

1. **🚪 방 생성 및 입장**: 플레이어는 닉네임과 방 번호를 입력하여 게임 방을 생성하거나 기존 방에 입장할 수 있습니다.
2. **💬 실시간 채팅**: 방 안의 모든 플레이어가 실시간으로 채팅할 수 있습니다.
3. **🕹️ 게임 시작 및 준비 상태 관리**: 모든 플레이어가 준비되면 게임이 시작됩니다.
4. **👆🏻 빙고 숫자 선택**: 각 플레이어는 자신의 차례에 숫자를 선택할 수 있습니다.
5. **⏰ 빙고 완료 알림**: 플레이어가 빙고를 완성하면 다른 플레이어에게 알림이 전송됩니다.
6. **🔚 게임 종료 및 리셋**: 게임이 종료되면 상태가 초기화됩니다.

## 📸 스크린샷

### 🌐 메인 화면
![Main Screen](./hello-bingo-new/public/images/git-main.png)

### 🌦️ 상세 날씨 정보 모달
![Weather Modal](./hello-bingo-new/public/images/git-game.png)

## 🛠️ 개발 과정

1. **프로젝트 초기 설정**: Node.js와 Express로 서버를 설정하고, React로 프론트엔드 환경을 구축했습니다.
2. **Socket.IO 통합**: Socket.IO를 사용하여 서버와 클라이언트 간의 실시간 통신을 구현했습니다.
3. **UI 디자인**: Material-UI를 사용하여 사용자 인터페이스를 디자인하고 스타일링했습니다.
4. **게임 로직 구현**: 빙고 게임의 핵심 로직을 작성하고, 각 방의 상태를 관리하기 위한 구조를 설계했습니다.
5. **테스트 및 디버깅**: 기능을 테스트하고, 발생하는 버그를 수정했습니다.

## ⚠️ 어려웠던 부분과 해결 과정

1. **API 호출 및 데이터 처리**
    - 실시간 통신은 처음에는 Socket.IO를 사용하는 것이 낯설었습니다. 하지만 관련 문서를 찾아보고 간단한 예제들을 따라해 보며 점차 이해하게 되었습니다. 특히, Socket.IO의 이벤트 기반 아키텍처를 이해하는 것이 중요했습니다. 클라이언트와 서버 간의 양방향 통신을 설정하고 데이터를 주고받는 과정에서 여러 문제가 발생했지만, 문서와 커뮤니티의 도움을 받아 이를 극복할 수 있었습니다.

2. **모달 창 내 데이터 동기화**
    - 모달 창을 통해 상세 날씨 정보를 표시할 때, 데이터의 동기화 문제가 발생했습니다. 특히, API 호출이 비동기적으로 이루어지기 때문에 모달 창이 열리기 전에 데이터가 로드되지 않는 경우가 있었습니다. 이를 해결하기 위해 모달 창을 열기 전에 데이터를 미리 로드하고, 로딩 상태를 관리하여 사용자에게 로딩 스피너를 표시했습니다.

3. **다국어 지원**
    - 한국어와 영어를 동시에 지원하기 위해 API 호출 시 `lang` 파라미터를 설정하여 한국어 데이터를 가져오도록 했습니다. 이 과정에서 API 응답 형식이 일부 다를 수 있어 데이터를 처리하는 로직을 조정했습니다.
