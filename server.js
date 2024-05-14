const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
// HTTP 서버를 생성, 라우팅
const server = http.createServer(app);
// Socket.IO 서버 생성, HTTP 서버 연결
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // 클라이언트 주소
    methods: ['GET', 'POST']
  }
});

// 포트 설정
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'hello-bingo-new/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/hello-bingo-new/build/index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/hello-bingo-new/build/index.html'));
});

// 각 방의 상태
const roomStates = {};

// 클라이언트가 소켓에 연결되면 실행
io.on('connection', (socket) => {
  console.log('a user connected');

  // 클라이언트가 특정 방에 입장할 때 실행
  socket.on('joinRoom', (nickname, roomNumber) => {
    socket.join(roomNumber);
    // 해당 방에 대한 상태를 초기화하고 새로운 플레이어 추가
    if (!roomStates[roomNumber]) {
      roomStates[roomNumber] = {
        players: [],
        currentPlayerIndex: 0 // 초기 currentPlayerIndex 설정
      };
    }

    // 새로운 플레이어 정보 저장
    const playerInfo = { id: socket.id, nickname: nickname };
    roomStates[roomNumber].players.push(playerInfo);

    // 방 안의 모든 클라이언트에게 입장 알림
    const message = `${nickname} 님이 방 ${roomNumber}에 입장하였습니다.`;
    console.log(message);
    io.to(roomNumber).emit('chatMessage', message);

    // 현재 차례 플레이어 닉네임 알림
    const currentPlayerNickname = roomStates[roomNumber].players[roomStates[roomNumber].currentPlayerIndex].nickname;
    io.to(roomNumber).emit('currentPlayer', currentPlayerNickname);
  });

  // 플레이어가 준비되었음을 알림
  socket.on('playerReady', (roomNumber) => {
    const roomState = roomStates[roomNumber];

    if (roomState) {
      const player = roomState.players.find(p => p.id === socket.id);
      console.log(roomState.players); // 플레이어 목록 출력

      // 플레이어가 정의되었는지 확인
      if (player) {
        console.log('player.id: ' + player.id);
        console.log('socket.id: ' + socket.id);

        player.ready = true;

        // 모든 플레이어가 준비되었는지 확인
        const allReady = roomState.players.length > 1 && roomState.players.every(player => player.ready);

        if (allReady) {
          io.to(roomNumber).emit('allPlayersReady');
        }
      } else {
        // 플레이어가 undefined인 경우
        console.log('해당 소켓 ID를 가진 플레이어를 찾을 수 없음: ' + socket.id);
      }
    }
  });

  // 채팅 메시지 전송 처리
  socket.on('sendMessage', (nickname, roomNumber, message) => {
    console.log(`Message received from ${nickname} in room ${roomNumber}: ${message}`); // 메시지를 받았는지 확인
    io.to(roomNumber).emit('chatMessage', `${nickname}: ${message}`);
  });

  // 빙고 메시지 전송 처리
  socket.on('sendBingo', ( roomNumber, message) => {
    io.to(roomNumber).emit('chatMessage', message);
  });

  // 숫자 선택 처리
  socket.on('selectNumber', (number, roomNumber, nickname) => {
    console.log(`${nickname} has selected ${number} in room ${roomNumber}`);
    io.to(roomNumber).emit('numberSelected', number, nickname);
    const message = `${nickname}님이 숫자 ${number}를 선택했습니다.`;
    io.to(roomNumber).emit('chatMessage', message);

    // 숫자를 선택한 후 차례 변경
    const roomState = roomStates[roomNumber];
    const currentPlayerIndex = roomState.players.findIndex(player => player.nickname === nickname);
    const nextPlayerIndex = (currentPlayerIndex + 1) % roomState.players.length;
    const nextPlayer = roomState.players[nextPlayerIndex];
    const currentPlayerNickname = nextPlayer.nickname;

    roomState.currentPlayerIndex = nextPlayerIndex;

    io.to(roomNumber).emit('currentPlayer', currentPlayerNickname);
  });

  // 플레이어가 방을 나갈 때
  socket.on('leaveRoom', (nickname, roomNumber) => {
    console.log(`${nickname} is leaving room ${roomNumber}`);
    socket.leave(roomNumber);

    // 해당 방의 상태에서 사용자 제거
    const roomState = roomStates[roomNumber];
    if (roomState) {
      roomState.players = roomState.players.filter(player => player !== nickname);
    }

    const message = `${nickname} 님이 방을 나가셨습니다.`;
    console.log(message);
    io.to(roomNumber).emit('chatMessage', message);
  });

  // 게임 종료 처리
  socket.on('gameEnd', (roomNumber) => {
    const roomState = roomStates[roomNumber];
    
    if (roomState) {
      // 모든 플레이어의 '준비 상태'를 false로 설정
      roomState.players.forEach(player => {
        player.ready = false;
      });
    }
    
    // 해당 방의 모든 클라이언트에게 게임 종료 알림
    io.to(roomNumber).emit('gameEnded');
  });

  // 클라이언트가 연결을 끊었을 때
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
