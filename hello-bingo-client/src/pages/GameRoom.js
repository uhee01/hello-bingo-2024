import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Button, Grid, Typography, Container, TextField, IconButton } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';

// 소켓 통신
import io from 'socket.io-client';

function GameRoom() {
  // React Hooks
  const location = useLocation();
  const { nickname, roomNumber } = location.state || {};

  // 채팅창 관련 state
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 소켓 통신 state
  const [socket, setSocket] = useState(null);

  // 게임 상태 및 데이터 관련 state 
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [bingoNumbers, setBingoNumbers] = useState([...Array(25).keys()].map(x => x + 1));
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [bingoCounts, setBingoCounts] = useState({});
  const [allPlayersReady, setAllPlayersReady] = useState(false); // 모든 플레이어가 준비됐는지 여부

  const navigate = useNavigate();

  // 컴포넌트가 처음으로 렌더링될 때 소켓 연결 설정
  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    // 메시지 수신 및 처리 함수
    const handleMessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
      console.log('Received message:', message);
    };

    // 서버로부터의 메시지 이벤트 
    newSocket.on('chatMessage', handleMessage);

    // 방 참여 요청 보내기
    newSocket.emit('joinRoom', nickname, roomNumber);

    // 선택된 숫자 이벤트 
    const handleNumberSelect = (number) => {
      setSelectedNumbers(prevNumbers => [...prevNumbers, number]);
    };
    newSocket.on('numberSelected', handleNumberSelect);

    // 현재 플레이어 설정 이벤트 
    newSocket.on('currentPlayer', (player) => {
      setCurrentPlayer(player);
    });

    // 모든 플레이어가 준비되었는지 확인
    newSocket.on('allPlayersReady', () => {
      setAllPlayersReady(true);
      let count = 3;
      setNotification(`게임이 ${count}초 후에 시작됩니다.`);
      const countdownInterval = setInterval(() => {
        count--;
        setNotification(`게임이 ${count}초 후에 시작됩니다.`);
        if (count === 0) {
          clearInterval(countdownInterval);
          setNotification(null);
          setGameStarted(true);
        }
      }, 1000);
    });

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      newSocket.off('chatMessage', handleMessage);
      newSocket.off('numberSelected', handleNumberSelect);
      newSocket.off('currentPlayer');
      newSocket.off('allPlayersReady');
      newSocket.close();
    };
  }, [nickname, roomNumber]);

  // 메시지가 추가될 때 스크롤을 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 메시지 입력 
  const handleMessageChange = (event) => {
    setMessageInput(event.target.value);
  };

  // 메시지 전송 
  const handleSendMessage = () => {
    if (messageInput.trim() !== '' && socket) {
      socket.emit('sendMessage', nickname, roomNumber, messageInput);
      setMessageInput('');
    }
  };

  // 엔터 키 입력 
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 알림 메시지 상태 설정
  const [notification, setNotification] = useState(null);

  // 게임 시작 핸들러
  const handleStartGame = () => {
    if (socket && !gameStarted) { // 게임이 이미 시작되었는지 확인
      socket.emit('playerReady', roomNumber);
    }
  };

  // 빙고 숫자 랜덤 생성 
  const generateRandomBingoNumbers = () => {
    const array = [...Array(25).keys()].map(x => x + 1);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setBingoNumbers(array);
  };

  // 랜덤 버튼 클릭 
  const handleRandomButtonClick = () => {
    generateRandomBingoNumbers();
  };

  // 빙고 카운트 계산 함수
  const calculateBingoCount = (selectedNumbers) => {
    let count = 0;
    let lines = [];

    for (let i = 0; i < 5; i++) {
      lines.push(bingoNumbers.slice(i * 5, i * 5 + 5));
    }

    for (let i = 0; i < 5; i++) {
      let line = [];
      for (let j = 0; j < 5; j++) {
        line.push(bingoNumbers[j * 5 + i]);
      }
      lines.push(line);
    }

    let diagonal1 = [];
    let diagonal2 = [];
    for (let i = 0; i < 5; i++) {
      diagonal1.push(bingoNumbers[i * 5 + i]);
      diagonal2.push(bingoNumbers[i * 5 + (4 - i)]);
    }
    lines.push(diagonal1, diagonal2);

    lines.forEach(line => {
      if (line.every(number => selectedNumbers.includes(number))) {
        count++;
      }
    });

    return count;
  };

  // 숫자 클릭 
  const handleNumberClick = (number) => {
    if (!gameStarted || currentPlayer !== nickname) {
      alert('현재 차례가 아닙니다!');
      return;
    }

    if (socket && !selectedNumbers.includes(number)) {
      const newSelectedNumbers = [...selectedNumbers, number];
      setSelectedNumbers(newSelectedNumbers);

      const previousBingoCount = calculateBingoCount(selectedNumbers);
      const newBingoCount = calculateBingoCount(newSelectedNumbers);

      if (newBingoCount > previousBingoCount) {
        const bingoMessage = `${nickname}님이 ${newBingoCount} 빙고를 완성했습니다!`;
        socket.emit('sendBingo', roomNumber, bingoMessage);

        if (newBingoCount >= 3) {
          const gameEndMessage = `축하합니다! ${nickname}님께서 ${newBingoCount}줄의 빙고를 완성하여 게임이 종료되었습니다.`;
          socket.emit('sendBingo', roomNumber, gameEndMessage);
          setGameStarted(false);

          // 게임 종료 메시지를 서버로 전송
          socket.emit('gameEnd', roomNumber);
        }
      }

      socket.emit('selectNumber', number, roomNumber, nickname);
    }
  };

  // 방 나가기 핸들러
  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', nickname, roomNumber);
      navigate('/'); // 방을 나간 후 홈 화면으로 이동
    }
  };

  // 게임 종료 핸들러
  useEffect(() => {
    if (socket) {
      socket.on('gameEnded', () => {
        setGameStarted(false);
      });

      return () => {
        socket.off('gameEnded');
      };
    }
  }, [socket]);

  // 게임 리셋
  const handleResetGame = () => {
    // 상태들을 초기화
    setGameStarted(false);
    setSelectedNumbers([]);
    setBingoCounts({});
    setAllPlayersReady(false);
    setNotification(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container style={{ backgroundColor: 'white', padding: '16px', width: '350px', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {notification && (
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '10px', borderRadius: '5px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '9999' }}>
            <Typography>{notification}</Typography>
          </div>
        )}
        <div style={{ alignSelf: 'flex-start' }}>
          {!gameStarted && (
            <IconButton onClick={handleLeaveRoom} style={{ marginRight: '8px' }}>
              <ExitToApp />
            </IconButton>
          )}
        </div>
        <Typography variant="h4" component="h1" style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: '10px' }}>BINGO!</Typography>
        <Typography variant="subtitle1" style={{ marginBottom: '10px', color: 'black', fontWeight: 'bold' }}>
          {gameStarted && (
            <span>현재 차례: <span style={{ color: '#4caf50' }}>{currentPlayer}</span></span>
          )}
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', justifyContent: 'center', gap: '5px', marginBottom: '16px', pointerEvents: gameStarted ? 'auto' : 'none', opacity: gameStarted ? 1 : 0.5 }}>
          {bingoNumbers.map((number, index) => (
            <Button
              key={index}
              variant="contained"
              style={{ backgroundColor: selectedNumbers.includes(number) ? 'grey' : '#FFFACD', color: 'black', padding: '16px', width: 'auto', height: 'auto' }}
              onClick={() => handleNumberClick(number)}
              disabled={!gameStarted || currentPlayer !== nickname}
            >
              {number}
            </Button>
          ))}
        </div>
        {!gameStarted && (
          <Grid container spacing={1} style={{ margin: '5px' }} justifyContent="center">
            {allPlayersReady ? (
              <Button
                variant="outlined"
                style={{ marginRight: '8px', fontSize: '0.75rem', color: 'black', borderColor: 'black' }}
                onClick={handleResetGame}
              >
                reset
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  style={{ marginRight: '8px', fontSize: '0.75rem', color: 'black', borderColor: 'black' }}
                  onClick={handleRandomButtonClick}
                >
                  random
                </Button>
                <Button
                  variant="outlined"
                  style={{ fontSize: '0.75rem', color: 'black', borderColor: 'black' }}
                  onClick={handleStartGame}
                >
                  ready
                </Button>
              </>
            )}
          </Grid>
        )}
        <div style={{ backgroundColor: '#FFE4E1', padding: '16px', width: '100%', marginBottom: '5px', maxHeight: '100px', overflowY: 'auto' }}>
          {messages.map((message, index) => (
            <Typography key={index} variant="body2">{message}</Typography>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <Grid container alignItems="center" justifyContent="space-between">
          <TextField
            variant="outlined"
            size="small"
            style={{ marginRight: '8px', width: '70%' }}
            value={messageInput}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            style={{ width: '25%', background: '#dc2626' }}
            onClick={handleSendMessage}
          >
            SEND
          </Button>
        </Grid>
      </Container>
    </div>
  );
}

export default GameRoom;
