import Pusher from 'pusher-js';

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  wsHost: import.meta.env.VITE_PUSHER_HOST,
  cluster: 'mt1',
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
});

setTimeout(() => {
  if (pusher.connection.state !== 'connected') {
    console.warn('Pusher connection state:', pusher.connection.state);
  } else {
    console.info('Pusher connected successfully');
  }
}, 2000);

export default pusher;
