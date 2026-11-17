import { createContext, useContext } from 'react';
import type { DeviceProfile } from '../hooks/useDeviceProfile';

export interface MotionSettings extends DeviceProfile {
  /** true when we should run the full cinematic experience */
  rich: boolean;
}

export const MotionContext = createContext<MotionSettings>({
  reducedMotion: false,
  finePointer: true,
  isMobile: false,
  lowPower: false,
  rich: true,
});

export const useMotion = () => useContext(MotionContext);
