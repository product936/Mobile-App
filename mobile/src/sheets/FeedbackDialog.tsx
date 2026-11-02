import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Check, MessageSquareHeart, Send, X } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { IconTile, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { submitFeedback, type FeedbackContext, type FeedbackRating } from '@/services/feedback';
import { useAppStore } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, shadows, type } from '@/theme/tokens';

export const FEEDBACK_MAX = 500;

/** Faces from hardest to easiest, with the label shown under the selected one. */
export const FEEDBACK_FACES: { rating: FeedbackRating; emoji: string; label: string }[] = [
  { rating: 1, emoji: '😞', label: 'Very hard' },
  { rating: 2, emoji: '🙁', label: 'Tricky' },
  { rating: 3, emoji: '😐', label: 'Okay' },
  { rating: 4, emoji: '🙂', label: 'Easy' },
  { rating: 5, emoji: '🤩', label: 'Very easy' },
];

const COPY: Record<FeedbackContext, { subtitle: string; question: string }> = {
  review_request: {
    subtitle: 'One tap helps us improve review requests for you.',
    question: 'Tap a face. How easy was sending this review request?',
  },
  status_update: {
    subtitle: 'One tap helps us improve lead updates for you.',
    question: 'Tap a face. How easy was updating this lead?',
  },
};

/**
 * "Quick feedback" after a completed task: a 1–5 ease rating (faces) and an
 * optional comment. "Skip for now", the close button and the backdrop all
 * dismiss without saving.
 */
export function FeedbackDialog() {
  const context = useAppStore((s) => s.feedbackPrompt);
  const close = useAppStore((s) => s.closeFeedback);
  // Keep the copy while the dialog fades out.
  const lastContext = useRef<FeedbackContext>('review_request');
  if (context) lastContext.current = context;
  const copy = COPY[context ?? lastContext.current];

  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!context) return;
    setRating(null);
    setComment('');
    setSending(false);
    setSent(false);
    setFailed(false);
  }, [context]);

  // Close shortly after the thank-you shows.
  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(close, 1600);
    return () => clearTimeout(id);
  }, [sent, close]);

  const send = async () => {
    if (!rating || !context || sending) return;
    setSending(true);
    setFailed(false);
    try {
      await submitFeedback({ context, rating, comment: comment.trim() });
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const selected = FEEDBACK_FACES.find((f) => f.rating === rating);

  return (
    <Dialog visible={!!context} onDismiss={close} horizontalInset={16} role="none" style={styles.card}>
      <View style={styles.header}>
        <IconTile size={48} rounded={radius.full}>
          <MessageSquareHeart size={22} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <View style={layout.flex1}>
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            Quick feedback?
          </Text>
          <Text size={type.callout} color={colors.textTertiary} style={{ marginTop: 2 }}>
            {copy.subtitle}
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} style={styles.close} hitSlop={6}>
          <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
        </Pressable>
      </View>

      {sent ? (
        <View style={styles.thanks} accessibilityLiveRegion="polite">
          <View style={styles.thanksIcon}>
            <Check size={26} color={colors.success} strokeWidth={2.6} />
          </View>
          <Text size={type.headline} weight={700} color={colors.textPrimary} align="center">
            Thanks for your feedback
          </Text>
          <Text size={type.callout} color={colors.textTertiary} align="center" style={{ marginTop: 4 }}>
            We use it to make this step easier.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.inner}>
            <Text size={type.callout} weight={600} color={colors.textSecondary} align="center">
              {copy.question}
            </Text>

            <View style={styles.faces} accessibilityRole="radiogroup">
              {FEEDBACK_FACES.map((f) => {
                const on = f.rating === rating;
                return (
                  <Pressable
                    key={f.rating}
                    accessibilityRole="radio"
                    accessibilityLabel={`${f.label}, ${f.rating} of 5`}
                    accessibilityState={{ selected: on }}
                    onPress={() => setRating(f.rating)}
                    style={[styles.face, on && styles.faceOn]}
                  >
                    <Text size={26} lineHeight={1.15} color={colors.textPrimary}>
                      {f.emoji}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.labelSlot} accessibilityLiveRegion="polite">
              <Text size={type.callout} weight={600} color={selected ? colors.amber600 : colors.textTertiary} align="center">
                {selected ? selected.label : 'Pick a face to rate this task'}
              </Text>
            </View>

            <TextInput
              accessibilityLabel="Tell us more, optional"
              value={comment}
              onChangeText={(t) => setComment(t.slice(0, FEEDBACK_MAX))}
              placeholder="Tell us more (optional). What worked, what didn't?"
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
              maxLength={FEEDBACK_MAX}
              style={styles.comment}
            />

            {failed ? (
              <Text size={type.footnote} color={colors.error} style={{ marginTop: 8 }} accessibilityRole="alert">
                We could not send your feedback. Check your connection and try again.
              </Text>
            ) : null}

            <View style={styles.footer}>
              <Text size={type.footnote} color={colors.textTertiary}>
                {comment.length}/{FEEDBACK_MAX}
              </Text>
              <Button
                label={failed ? 'Try again' : 'Send feedback'}
                height={42}
                fontSize={type.callout}
                weight={600}
                disabled={!rating}
                loading={sending}
                onPress={send}
                style={styles.sendBtn}
                iconLeft={<Send size={16} color={rating ? colors.white : colors.textTertiary} strokeWidth={2} />}
              />
            </View>
          </View>

          <Pressable accessibilityRole="button" onPress={close} style={styles.skipLater} hitSlop={8}>
            <Text size={type.callout} weight={500} color={colors.textTertiary} style={{ textDecorationLine: 'underline' }}>
              Skip for now
            </Text>
          </Pressable>
        </>
      )}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  card: { maxWidth: 420, borderRadius: 24, padding: 20, boxShadow: shadows.xl },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  close: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  faces: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 },
  face: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOn: {
    backgroundColor: colors.amber100,
    borderWidth: 3,
    borderColor: colors.starAmber,
    transform: [{ scale: 1.12 }],
  },
  labelSlot: { minHeight: 22, marginTop: 10, justifyContent: 'center' },
  comment: {
    marginTop: 12,
    minHeight: 84,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    fontFamily: fontFamily(400),
    fontSize: type.callout,
    color: colors.textPrimary,
    outlineStyle: 'none',
  } as object,
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  sendBtn: { alignSelf: 'auto', paddingHorizontal: 16, boxShadow: 'none' },
  skipLater: { alignSelf: 'center', marginTop: 16, paddingVertical: 4 },
  thanks: { alignItems: 'center', paddingVertical: 18 },
  thanksIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
