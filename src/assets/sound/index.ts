import WindowOpenMp3 from './open_win.mp3';
import WindowCloseMp3 from './close_win.mp3';
import Dong from './effect_btn.dong.mp3';
import Ding from './effect_drop.ding.mp3';
import DDing from './switch_task.mp3';

const handlePlayMp3Resource = (resource: string, volume: number = 1) => {
  const mp3 = new Audio(resource);
  mp3.volume = volume;
  return {
    once() {
      const once = new Audio(resource);
      once.play();
    },
    play() {
      mp3.play();
    },
    pause() {
      mp3.pause();
    },
    replay() {
      mp3.currentTime = 0;
      mp3.play();
    }
  };
};

export default {
  winOpen: handlePlayMp3Resource(WindowOpenMp3),
  winClose: handlePlayMp3Resource(WindowCloseMp3),
  Dong: handlePlayMp3Resource(Dong, 0.4),
  Ding: handlePlayMp3Resource(Ding),
  DDing: handlePlayMp3Resource(DDing)
};
