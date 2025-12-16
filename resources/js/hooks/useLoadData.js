import { useEffect } from "react";
import pusher from "../pusher";

export default function useLoadData(callback) {
  useEffect(() => {
    if (!import.meta.env.VITE_PUSHER_APP_KEY) {
      return;
    }
    const channel = pusher.subscribe('load-data-channel');
    channel.bind('load-data-event', function(data) {
      setTimeout(() => {
        callback(data);
      }, 1000);
    });
  }, []);
}
