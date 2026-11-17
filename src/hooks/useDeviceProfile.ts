import { useEffect, useState } from 'react';

export interface DeviceProfile {
  reducedMotion: boolean;
  /** Mouse / trackpad (not touch) */
  finePointer: boolean;
  isMobile: boolean;
  /** Rough guess at a low-powered device: few cores, little memory, or save-data on */
  lowPower: boolean;
}

function read(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { reducedMotion: false, finePointer: true, isMobile: false, lowPower: false };
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;

  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    isMobile: window.matchMedia('(max-width: 767px)').matches,
    lowPower: cores <= 4 || memory <= 4 || saveData,
  };
}

/** One place that decides how much animation the current device should get. */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(read);

  useEffect(() => {
    const queries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(hover: hover) and (pointer: fine)'),
      window.matchMedia('(max-width: 767px)'),
    ];
    const update = () => setProfile(read());
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);

  return profile;
}
