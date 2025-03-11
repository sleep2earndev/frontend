import { useState } from "react";

const storageKey = "napnad-energy";
function getDefaultDataSleep() {
  const energyStorage = localStorage.getItem(storageKey);
  if ([null, undefined, ""].includes(energyStorage)) {
    return Number(energyStorage) || 0;
  }

  return 0;
}

export default function useEnergy() {
  const [energyUsed, setEnergyUsed] = useState<number>(() =>
    getDefaultDataSleep()
  );

  function updateEnergyUsed() {
    setEnergyUsed((prev) => {
      const newEnergy = prev + 1;
      localStorage.setItem(storageKey, String(newEnergy));
      return newEnergy;
    });
  }

  return { energyUsed, updateEnergyUsed };
}
