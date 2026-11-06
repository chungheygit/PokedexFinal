import { NativeTabs } from 'expo-router/native-tabs';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.card}
      indicatorColor={theme.background}
      iconColor={{ default: theme.textSecondary, selected: theme.primary }}
      labelStyle={{
        default: { color: theme.textSecondary, fontFamily: Fonts.regular },
        selected: { color: theme.primary, fontFamily: Fonts.regular },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Pokémons</NativeTabs.Trigger.Label>
        {/* Our own PNG: Material Symbols has no `catching_pokemon` glyph, so `md` draws a missing-glyph box. */}
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/pokeball.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
