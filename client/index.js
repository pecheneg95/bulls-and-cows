const loginBtn = document.querySelector('.login-btn');
const createGameBtn = document.querySelector('.create-game-btn');
const leaderboardBtn = document.querySelector('.leaderboard-btn');

let socket;
let token;

loginBtn.addEventListener('click', login);
createGameBtn.addEventListener('click', createGame);
leaderboardBtn.addEventListener('click', getLeaderboard);

async function login() {
  const emailValue = document.querySelector('.email').value;
  const passwordValue = document.querySelector('.password').value;

  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify({ "email": emailValue, "password": passwordValue })
  });

  if (response.status === 200) {
    token = await response.json();
    console.log(token);
  }

  if (token) {
    localStorage.setItem('token', token);

    socketConnect();
  }

  function socketSendHello() {
    socket.send(JSON.stringify({ event: 'hello', payload: {} }));
  }

  function socketConnect() {
    socket = io("ws://localhost:8081", {
      query: {
        token: token
      }
    });

    socket.connect();
    socket.on('connect', () => console.log('Connection established!'));

    socket.on('invite', (userId) => {
      try {
        invite(userId);
      } catch (err) {
        console.log(err);
      }
    });

    socketSendHello();
  }
}

async function createGame() {
  const opponentId = document.querySelector('.opponent').value.trim();

  if (opponentId.length > 0) {
    const response = await fetch('http://localhost:8080/games', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }, body: JSON.stringify({ "opponentId": opponentId })
    });

    const game = await response.json();
    console.log(game);
  }
}

async function getLeaderboard() {
  const url = new URL('http://localhost:8080/users/leaderboard')

  const sortField = document.querySelector('.sortField').value;
  const dateFrom = document.querySelector('.dateFrom').value;
  const dateTo = document.querySelector('.dateTo').value;
  const offset = document.querySelector('.offset').value;
  const limit = document.querySelector('.limit').value;

  if (sortField.trim().length > 0) {
    url.searchParams.append('sort', sortField)
  }
  if (dateFrom.trim().length > 0) {
    url.searchParams.append('from', dateFrom)
  }
  if (dateTo.trim().length > 0) {
    url.searchParams.append('to', dateTo)
  }
  if (offset.trim().length > 0) {
    url.searchParams.append('offset', offset)
  }
  if (limit.trim().length > 0) {
    url.searchParams.append('limit', limit)
  }

  const response = await fetch(url);

  const leaderboard = await response.json();

  console.log(leaderboard)
}

function invite(userId) {
  const main = document.querySelector('main');

  const push = document.createElement('div');
  push.classList.add('push');

  const pushTitle = document.createElement('div');
  pushTitle.textContent = 'You have invite from user:';
  pushTitle.classList.add('push-title');
  push.append(pushTitle);

  const userIdDiv = document.createElement('div');
  userIdDiv.textContent = userId;
  userIdDiv.classList.add('push-userId');
  push.append(userIdDiv)


  main.append(push);

  setTimeout(() => {
    push.classList.add('push-visible')
  }, 0)

  setTimeout(() => {
    push.classList.remove('push-visible')
    setTimeout(() => { main.removeChild(push) }, 3000)
  }, 3000)
}