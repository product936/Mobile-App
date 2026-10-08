import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Camera, Image as ImageIcon, Paperclip, Trash2, type LucideIcon } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { FieldLabel, TextArea, TextField } from '@/components/fields';
import { IconTile, layout } from '@/components/primitives';
import { Sheet, SheetBottomInset, SheetFooter, SheetGrabber, SheetHeader } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useAppStore } from '@/state/store';
import { colors, motion, radius, shadows, type } from '@/theme/tokens';

/** "Raise a ticket": title, description and an attachment. */
export function SupportSheet() {
  const visible = useAppStore((s) => s.sheet === 'support');
  const close = useAppStore((s) => s.closeSheet);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
    }
  }, [visible]);

  return (
    <Sheet visible={visible} onClose={close} maxHeightRatio={0.92} accessibilityLabel="Raise a ticket">
      <SheetGrabber bottom={4} />
      <SheetHeader title="Raise a ticket" onClose={close} paddingX={22} />
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <FieldLabel>Title</FieldLabel>
        <TextField accessibilityLabel="Ticket title" value={title} onChangeText={setTitle} placeholder="Briefly, what's the issue?" />
        <View style={{ height: 16 }} />
        <FieldLabel>Description</FieldLabel>
        <TextArea
          accessibilityLabel="Ticket description"
          value={description}
          onChangeText={setDescription}
          placeholder="Add details so we can help faster"
        />
        <View style={{ height: 16 }} />
        <Pressable accessibilityRole="button" style={styles.attach}>
          <Paperclip size={18} color={colors.textTertiary} strokeWidth={2} />
          <Text size={type.callout} weight={600} color={colors.textSecondary}>
            Add attachment
          </Text>
        </Pressable>
      </ScrollView>
      <SheetFooter style={[layout.row, { gap: 10 }]}>
        <Button label="Cancel" variant="outline" style={{ flex: 38 }} onPress={close} />
        <Button label="Raise ticket" style={{ flex: 62 }} onPress={close} />
      </SheetFooter>
    </Sheet>
  );
}

/** "Add image": take a photo or choose from the gallery. */
export function UploadSheet() {
  const visible = useAppStore((s) => s.sheet === 'upload');
  const close = useAppStore((s) => s.closeSheet);
  return (
    <Sheet visible={visible} onClose={close} accessibilityLabel="Add image">
      <SheetGrabber />
      <View style={{ paddingTop: 6, paddingHorizontal: 22, paddingBottom: 10 }}>
        <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
          Add image
        </Text>
      </View>
      <View style={{ paddingTop: 4, paddingHorizontal: 16, paddingBottom: 16 }}>
        <UploadOption Icon={Camera} title="Take a photo" sub="Use your camera" onPress={close} />
        <UploadOption Icon={ImageIcon} title="Choose from gallery" sub="Pick an existing photo" onPress={close} />
      </View>
      <View style={{ paddingHorizontal: 22 }}>
        <Button label="Cancel" variant="muted" onPress={close} />
      </View>
      <SheetBottomInset extra={16} />
    </Sheet>
  );
}

function UploadOption({ Icon, title, sub, onPress }: { Icon: LucideIcon; title: string; sub: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.surfaceBase }]}
    >
      <IconTile size={44}>
        <Icon size={22} color={colors.primaryAccent} strokeWidth={2} />
      </IconTile>
      <View style={layout.flex1}>
        <Text size={type.callout} weight={700} color={colors.textPrimary}>
          {title}
        </Text>
        <Text size={type.footnote} color={colors.textTertiary}>
          {sub}
        </Text>
      </View>
    </Pressable>
  );
}

/** Centered confirmation before deleting a reply. */
export function DeleteReplyDialog() {
  const id = useAppStore((s) => s.confirmDeleteReplyId);
  const setId = useAppStore((s) => s.setConfirmDeleteReply);
  const deleteReply = useAppStore((s) => s.deleteReply);
  const reduced = useReducedMotion();
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!id) return;
    pop.setValue(0);
    Animated.timing(pop, { toValue: 1, duration: reduced ? 0 : 200, easing: motion.easeOut, useNativeDriver: true }).start();
  }, [id, reduced, pop]);

  const dismiss = () => setId(null);

  return (
    <Modal transparent visible={!!id} animationType="fade" statusBarTranslucent onRequestClose={dismiss}>
      <Pressable style={styles.scrim} onPress={dismiss} accessibilityLabel="Cancel" accessibilityRole="button" />
      <View style={styles.center} pointerEvents="box-none">
        <Animated.View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[
            styles.dialog,
            { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }] },
          ]}
        >
          <View style={styles.dialogIcon}>
            <Trash2 size={22} color={colors.error} strokeWidth={2} />
          </View>
          <Text size={type.title3} weight={700} color={colors.textPrimary}>
            Delete this reply?
          </Text>
          <Text size={type.body} color={colors.textSecondary} style={{ marginTop: 8 }}>
            This will permanently delete your reply to this review. This action can’t be undone.
          </Text>
          <View style={[layout.row, { gap: 10, marginTop: 20 }]}>
            <Button label="Cancel" variant="outline" height={46} style={layout.flex1} onPress={dismiss} />
            <Button
              label="Delete"
              variant="danger"
              height={46}
              style={layout.flex1}
              onPress={() => {
                if (id) deleteReply(id);
                dismiss();
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: 16, paddingHorizontal: 22, paddingBottom: 20 },
  attach: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceBase,
  },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.input },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.scrimStrong },
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', padding: 24 },
  dialog: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.card,
    boxShadow: shadows.xl,
    paddingVertical: 24,
    paddingHorizontal: 22,
  },
  dialogIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
});
