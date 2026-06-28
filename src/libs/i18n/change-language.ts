import { reloadAppAsync } from 'expo';
import { I18nManager } from 'react-native';

import type { AppLanguage } from '@/stores/settings-store';
import i18n from './index';

/**
 * Applies a language change as an explicit user action: updates i18next, and — only when the
 * layout direction actually needs to flip (e.g. en ⇄ ar) — forces RTL and restarts the app once so
 * the new direction takes effect everywhere. Restarting is required by React Native's `I18nManager`.
 *
 * Keep the reload here (a deliberate action) rather than in a startup effect, so a dev client that
 * doesn't persist `forceRTL` can't get stuck in a reload loop.
 */
export async function changeAppLanguage(language: AppLanguage) {
  await i18n.changeLanguage(language);

  const shouldBeRTL = language === 'ar';
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    await reloadAppAsync();
  }
}
