import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS !== 'web';

/** Thin, no-op-on-web wrapper around expo-haptics so you can sprinkle feedback without guards. */
export const haptics = {
  impact: (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (enabled) void Haptics.impactAsync(style);
  },
  selection: () => {
    if (enabled) void Haptics.selectionAsync();
  },
  success: () => {
    if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  error: () => {
    if (enabled) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
};
