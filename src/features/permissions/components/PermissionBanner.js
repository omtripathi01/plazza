// Card for one permission that is not granted. Denied -> "Allow", Blocked -> "Open Settings".
import React, {useMemo} from 'react';
import AppText from '../../../shared/components/AppText';
import {Linking, StyleSheet, View} from 'react-native';
import {fontSize, radius, shadow, spacing} from '../../../shared/theme/theme';
import {useColors} from '../../../shared/theme/themeStore';
import Button from '../../../shared/components/Button';

export default function PermissionBanner({title, status, reason, onAllow}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const blocked = status === 'blocked';
  return (
    <View style={styles.card}>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.reason}>{reason}</AppText>
      {blocked ? (
        <Button
          title="Open Settings"
          variant="outline"
          onPress={() => Linking.openSettings()}
          accessibilityLabel={`Open settings to allow ${title}`}
        />
      ) : (
        <Button
          title="Allow"
          onPress={onAllow}
          accessibilityLabel={`Allow ${title}`}
        />
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius,
      ...shadow,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    title: {fontSize: fontSize.body, fontWeight: '600', color: colors.text},
    reason: {
      fontSize: fontSize.small,
      color: colors.muted,
      marginVertical: spacing.sm,
    },
  });
}
