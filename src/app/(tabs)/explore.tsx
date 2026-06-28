import { BottomSheet, Button, Column, Host, Picker, Slider, Switch } from '@expo/ui';
import { Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Account } from '@/components/account';
import { GlassCard } from '@/components/glass-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { changeAppLanguage } from '@/libs/i18n/change-language';
import { isAuthConfigured } from '@/lib/env';
import {
  type AppLanguage,
  type ColorSchemePreference,
  useSettingsStore,
} from '@/stores/settings-store';

const DENSITY_OPTIONS = ['comfortable', 'compact', 'spacious'] as const;
type Density = (typeof DENSITY_OPTIONS)[number];

const COLOR_SCHEME_OPTIONS: ColorSchemePreference[] = ['system', 'light', 'dark'];
const LANGUAGE_OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
];

export default function ShowcaseScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const { t } = useTranslation();

  const [reduceMotion, setReduceMotion] = useState(false);
  const [scale, setScale] = useState(0.5);
  const [density, setDensity] = useState<Density>('comfortable');
  const [sheetOpen, setSheetOpen] = useState(false);

  const colorSchemePreference = useSettingsStore((state) => state.colorScheme);
  const setColorSchemePreference = useSettingsStore((state) => state.setColorScheme);
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const onSelectLanguage = (value: AppLanguage) => {
    if (value === language) return;
    setLanguage(value);
    void changeAppLanguage(value);
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: { paddingTop: Spacing.six, paddingBottom: Spacing.four },
    default: { paddingBottom: insets.bottom },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Showcase</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Liquid glass, native Expo UI controls, and NativeWind — all in one screen.
          </ThemedText>
        </ThemedView>

        <View style={styles.sections}>
          {/* NativeWind (Tailwind) — styled entirely with className + shared design tokens. */}
          <Section title="NativeWind">
            <View className="gap-two rounded-[24px] bg-surface p-four">
              <Text className="font-rounded text-base font-semibold text-text">
                Styled with className
              </Text>
              <Text className="text-sm text-text-secondary">
                Colors and spacing come from the shared tokens, so utility classes and the themed
                StyleSheet components always match in light and dark mode.
              </Text>
              <View className="flex-row gap-two">
                <View className="h-8 flex-1 rounded-full bg-background" />
                <View className="h-8 flex-1 rounded-full bg-surface-selected" />
              </View>
            </View>
          </Section>

          {/* expo-glass-effect — real Liquid Glass on iOS 26, themed fallback elsewhere. */}
          <Section title="Liquid glass">
            <GlassCard>
              <ThemedText type="smallBold">GlassCard</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Renders a native glass surface where supported, and a solid themed card everywhere
                else — no conditional code on your end.
              </ThemedText>
            </GlassCard>
          </Section>

          {/* i18next + persisted language. Switching to Arabic flips the layout to RTL. */}
          <Section title={t('settings.language')}>
            <Host matchContents style={styles.host}>
              <Picker selectedValue={language} onValueChange={onSelectLanguage}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </Host>
          </Section>

          {/* Zustand store driving the app theme — persisted across launches. */}
          <Section title="Appearance (Zustand)">
            <Host matchContents style={styles.host}>
              <Picker
                selectedValue={colorSchemePreference}
                onValueChange={setColorSchemePreference}
              >
                {COLOR_SCHEME_OPTIONS.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </Host>
          </Section>

          {/* Clerk — Google + GitHub OAuth with SignedIn/SignedOut gating. */}
          <Section title="Account (Clerk)">
            {isAuthConfigured ? (
              <Account />
            ) : (
              <>
                <ThemedText type="small" themeColor="textSecondary">
                  Clerk isn’t configured yet. The sign-in screen is still reachable below — add
                  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to enable Google + GitHub auth.
                </ThemedText>
                <Link href="/sign-in" asChild>
                  <Pressable
                    style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
                  >
                    <ThemedText type="smallBold" style={styles.linkButtonLabel}>
                      Open sign-in
                    </ThemedText>
                  </Pressable>
                </Link>
              </>
            )}
          </Section>

          {/* @expo/ui — native SwiftUI / Jetpack Compose primitives, universal API. */}
          <Section title="Native controls (Expo UI)">
            <Host matchContents style={styles.host}>
              <Column spacing={Spacing.three}>
                <Switch
                  value={reduceMotion}
                  onValueChange={setReduceMotion}
                  label="Reduce motion"
                />
                <Slider value={scale} onValueChange={setScale} min={0} max={1} />
                <Picker selectedValue={density} onValueChange={setDensity}>
                  {DENSITY_OPTIONS.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
                <Button
                  variant="filled"
                  label="Open bottom sheet"
                  onPress={() => setSheetOpen(true)}
                />
              </Column>
            </Host>
          </Section>
        </View>
      </ThemedView>

      <BottomSheet
        isPresented={sheetOpen}
        onDismiss={() => setSheetOpen(false)}
        snapPoints={['half']}
      >
        <View style={styles.sheetContent}>
          <ThemedText type="smallBold">Native bottom sheet</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            A drop-in replacement for community sheet libraries, backed by the platform.
          </ThemedText>
          <Host matchContents>
            <Button variant="outlined" label="Close" onPress={() => setSheetOpen(false)} />
          </Host>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {title.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    width: '100%',
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.four,
  },
  sections: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  host: {
    alignSelf: 'stretch',
  },
  linkButton: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    alignSelf: 'flex-start',
  },
  linkButtonLabel: { color: '#ffffff' },
  pressed: { opacity: 0.8 },
  sheetContent: {
    gap: Spacing.three,
    padding: Spacing.four,
  },
});
