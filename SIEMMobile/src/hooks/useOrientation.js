import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * Track the current screen orientation and dimensions
 * @returns {{
 *   orientation: number|null,
 *   isLandscape: boolean,
 *   width: number,
 *   height: number
 * }} Current orientation information
 */
export const useOrientation = () => {
  const { width, height } = useWindowDimensions();
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    const subscription =
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    orientation,
    isLandscape: width > height,
    width,
    height,
  };
};
