import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Avatar, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

function WaitingRoom() {
  const [nickname, setNickname] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const navigate = useNavigate();

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleRoomNumberChange = (event) => {
    setRoomNumber(event.target.value);
  };

  const handleEnter = () => {
    navigate('/gameroom', { state: { nickname, roomNumber } });
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#fafafa', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ bgcolor: '#ab47bc', marginBottom: '10px' }}>
              <PersonIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5" sx={{ marginBottom: 2, color: '#880e4f', fontWeight: 'bold' }}>빙고 게임에 오신 것을 환영합니다!</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" sx={{ marginBottom: 2, textAlign: 'center', lineHeight: '1.6' }}>
              이곳은 빙고 게임 대기실입니다. 게임에 참여하려면 닉네임과 방 번호를 입력하고 '입장' 버튼을 클릭하세요. <br />
              빙고 게임은 가로, 세로, 대각선 중 총 3줄을 완성하면 이기는 게임입니다. <br />
              친구들과 함께 플레이하며 즐거운 시간을 보내세요!
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item container spacing={2} justifyContent="center">
            <Grid item>
              <TextField
                margin="dense"
                id="roomNumber"
                label="방 번호"
                type="text"
                variant="outlined"
                value={roomNumber}
                onChange={handleRoomNumberChange}
              />
            </Grid>
            <Grid item>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="닉네임"
                type="text"
                variant="outlined"
                value={nickname}
                onChange={handleNicknameChange}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button
              onClick={handleEnter}
              variant="contained"
              color="primary"
              sx={{
                bgcolor: '#d81b60',
                ':hover': {
                  bgcolor: '#c2185b',
                },
                ':active': {
                  bgcolor: '#ad1457'
                }
              }}>
              입장
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default WaitingRoom;
