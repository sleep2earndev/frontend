import { useState } from "react";

const useAlarm = () => {
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [isAlarmCalled, setIsAlarmCalled] = useState(false)

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
    }, timeDifference);
  };

  // Memainkan suara alarm
  const playAlarm = () => {
    setIsAlarmCalled(true)
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
    setIsAlarmCalled(false)
  };

  return { setAlarm, stopAlarm, isAlarmActive, isAlarmCalled, playAlarm };
};

export default useAlarm;
