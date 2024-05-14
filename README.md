# 🎉 Bingo Game Project 🎉

## 프로젝트 개요

이 프로젝트는 **실시간**으로 여러 플레이어가 함께 즐길 수 있는 온라인 빙고 게임 애플리케이션을 만드는 것을 목표로 합니다. 플레이어는 각자 방을 생성하고, 다른 플레이어들과 함께 빙고 게임을 즐길 수 있습니다. 이 프로젝트는 웹 소켓을 이용한 실시간 통신과 상태 관리를 포함하고 있습니다.

## 기술 스택

- **프론트엔드**: ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
- **백엔드**: ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
- **실시간 통신**: ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
- **배포**: ![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)

## 주요 기능

1. **방 생성 및 입장**: 플레이어는 닉네임과 방 번호를 입력하여 게임 방을 생성하거나 기존 방에 입장할 수 있습니다.
2. **실시간 채팅**: 방 안의 모든 플레이어가 실시간으로 채팅할 수 있습니다.
3. **게임 시작 및 준비 상태 관리**: 모든 플레이어가 준비되면 게임이 시작됩니다.
4. **빙고 숫자 선택**: 각 플레이어는 자신의 차례에 숫자를 선택할 수 있습니다.
5. **빙고 완료 알림**: 플레이어가 빙고를 완성하면 다른 플레이어에게 알림이 전송됩니다.
6. **게임 종료 및 리셋**: 게임이 종료되면 상태가 초기화됩니다.

## 개발 과정 흐름

1. **프로젝트 초기 설정**: Node.js와 Express로 서버를 설정하고, React로 프론트엔드 환경을 구축했습니다.
2. **Socket.IO 통합**: Socket.IO를 사용하여 서버와 클라이언트 간의 실시간 통신을 구현했습니다.
3. **게임 로직 구현**: 빙고 게임의 핵심 로직을 작성하고, 각 방의 상태를 관리하기 위한 구조를 설계했습니다.
4. **UI 디자인**: Material-UI를 사용하여 사용자 인터페이스를 디자인하고 스타일링했습니다.
5. **테스트 및 디버깅**: 기능을 테스트하고, 발생하는 버그를 수정했습니다.
6. **배포**: Heroku를 사용하여 애플리케이션을 배포했습니다.

## 어려웠던 부분과 해결 과정

### 1. 실시간 통신의 안정성 확보
- **문제**: 실시간 통신 중 연결이 끊기거나 메시지가 지연되는 문제가 발생했습니다.
- **해결**: Socket.IO의 재연결 기능을 활용하고, 메시지 전송 실패 시 재시도 로직을 구현했습니다.

### 2. 상태 관리
- **문제**: 각 방의 상태를 정확하게 관리하고, 동기화하는 것이 어려웠습니다.
- **해결**: 방 별로 상태 객체를 생성하고, 상태 변경 시마다 클라이언트에게 업데이트를 전송하도록 했습니다.

### 3. 동시성 문제
- **문제**: 여러 플레이어가 동시에 액션을 취할 때 발생하는 동시성 문제를 해결해야 했습니다.
- **해결**: 서버에서 이벤트 처리를 순차적으로 처리하도록 하고, 클라이언트에서 이벤트 중복 처리를 방지했습니다.
