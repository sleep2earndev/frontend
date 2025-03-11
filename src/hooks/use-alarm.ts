import { useState } from "react";

const useAlarm = () => {
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Jadwalkan alarm berdasarkan rawTime
  const setAlarm = (rawTime: string) => {
    const endTimeDate = new Date(rawTime);
    const timeDifference = endTimeDate.getTime() - Date.now();

    if (timeDifference <= 0) {
        stopAlarm()
      return;
    }

    setIsAlarmActive(true);
    setTimeout(() => {
      playAlarm();
      stopAlarm();
    }, timeDifference);
  };

  // Memainkan suara alarm
  const playAlarm = () => {
    if (!audio) {
      const alarmAudio = new Audio("/alarm.wav"); // Sesuaikan path file alarm
      alarmAudio.loop = true;
      setAudio(alarmAudio);
      alarmAudio.play();
    } else {
      audio.play();
    }
  };

  // Menghentikan alarm
  const stopAlarm = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsAlarmActive(false);
  };

  return { setAlarm, stopAlarm, isAlarmActive };
};

export default useAlarm;
