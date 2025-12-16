import Pusher from 'pusher-js';

if (!import.meta.env.VITE_PUSHER_APP_KEY) {
  console.warn('Pusher app key is not set. Real-time features will be disabled.');
}

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  cluster: 'mt1',
  forceTLS: import.meta.env.VITE_PUSHER_ENCRYPTED === 'true',
  encrypted: true,
  disableStats: true,
  enabledTransports: [import.meta.env.VITE_PUSHER_ENCRYPTED === 'true' ? 'wss' : 'ws'],
  wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
  wssPort: import.meta.env.VITE_PUSHER_PORT || 6001,
});

setTimeout(() => {
  if (pusher.connection.state !== 'connected') {
    console.warn('Pusher connection state:', pusher.connection.state);
  } else {
    console.info('Pusher connected successfully');
  }
}, 2000);

export default pusher;
