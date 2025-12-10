import { useEffect } from "react";
import pusher from "../pusher";

export default function useLoadData(callback) {
  useEffect(() => {
    const channel = pusher.subscribe('load-data-channel');
    channel.bind('load-data-event', function(data) {
      callback(data);
    });
  }, []);
}
