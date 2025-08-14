import { createServer } from 'http';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://ao-website-1.onrender.com", // Twój frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

const TICK = 50; // 20 Hz
const rooms = new Map();

function getOrCreateRoom(roomId = 'default') {
  if (!rooms.has(roomId)) rooms.set(roomId, { players: new Map() });
  return rooms.get(roomId);
}

io.on('connection', (socket) => {
  const playerId = nanoid(8);
  const room = getOrCreateRoom('default');

  const player = {
    id: playerId,
    x: Math.random() * 10 - 5,
    y: 0,
    z: Math.random() * 10 - 5,
    yaw: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    input: { left: 0, right: 0, strafeLeft: 0, strafeRight: 0, jump: false, drift: false, up:0, down:0 },
  };
  room.players.set(playerId, player);

  socket.join('default');
  socket.emit('welcome', { id: playerId, snapshot: snapshot(room) });
  socket.to('default').emit('player_joined', { id: playerId });

  socket.on('input', (data) => {
    const p = room.players.get(playerId);
    if (!p) return;
    p.input = { ...p.input, ...data };
  });

  socket.on('disconnect', () => {
    room.players.delete(playerId);
    socket.to('default').emit('player_left', { id: playerId });
  });
});

function snapshot(room) {
  return Array.from(room.players.values()).map((p) => ({
    id: p.id,
    x: p.x,
    y: p.y,
    z: p.z,
    yaw: p.yaw
  }));
}

setInterval(() => {
  const room = rooms.get('default');
  if (!room) return;
  const dt = TICK / 1000;

  room.players.forEach((p) => {
    const turnSpeed = 2.0;
    const strafeSpeed = 4.0;
    const forwardSpeed = 8.0;
    const driftFactor = p.input.drift ? 1.5 : 1.0;

    // obrót
    p.yaw += (p.input.right - p.input.left) * turnSpeed * dt;

    // ruch do przodu/tyłu
    const forward = (p.input.up || 0) - (p.input.down || 0);
    const dirX = Math.sin(p.yaw);
    const dirZ = Math.cos(p.yaw);

    p.vx = dirX * forwardSpeed * forward * driftFactor;
    p.vz = dirZ * forwardSpeed * forward * driftFactor;

    // strafe
    const strafe = (p.input.strafeRight - p.input.strafeLeft) * strafeSpeed;
    p.vx += Math.cos(p.yaw) * strafe;
    p.vz += -Math.sin(p.yaw) * strafe;

    // skok
    const gravity = -20;
    if (p.input.jump && p.y === 0) p.vy = 7.5;
    p.vy += gravity * dt;

    // integracja
    p.x += p.vx * dt;
    p.z += p.vz * dt;
    p.y = Math.max(0, p.y + p.vy * dt);
    if (p.y === 0 && p.vy < 0) p.vy = 0;
  });

  const state = snapshot(room);
  io.to('default').volatile.emit('state', state);
}, TICK);

httpServer.listen(3001, () => console.log('Server listening on :3001'));
