import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RefreshCw, Send } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { RadioDot } from '@/components/controls';
import { AiSparkGlyph } from '@/components/glyphs';
import { Avatar, layout } from '@/components/primitives';
import { Sheet, SheetCloseButton, SheetFooter, SheetGrabber } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { AVATAR_COLORS, type Review } from '@/data/content';
import { REPLY_MAX, type ReplyOption } from '@/lib/reviews';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { generateReplyOptions, postReply } from '@/services/reviews';
import { fontFamily } from '@/theme/fonts';
import { colors, motion, radius, type } from '@/theme/tokens';

/**
 * "Draft with AI": a sheet with the review as its header and three AI reply
 * options stacked below it, with "Regenerate" at the top right. Picking an
 * option makes it editable in place; "Post reply" posts the picked one, as
 * edited. Nothing is posted until then.
 */
export function ReplyOptionsSheet({
  review,
  editing = false,
  onClose,
  onPosted,
}: {
  /** The review to reply to; the sheet is open while this is set. */
  review: Review | null;
  /** Replacing an existing reply ("Update reply") rather than posting a first one. */
  editing?: boolean;
  onClose: () => void;
  onPosted: (text: string) => void;
}) {
  // Keep showing the last review while the sheet animates closed.
  const last = useRef(review);
  if (review) last.current = review;
  const shown = review ?? last.current;

  const [options, setOptions] = useState<ReplyOption[] | null>(null);
  const [round, setRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [draftFailed, setDraftFailed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [posting, setPosting] = useState(false);
  const [postFailed, setPostFailed] = useState(false);

  const generate = async (nextRound: number) => {
    if (!shown) return;
    setLoading(true);
    setDraftFailed(false);
    setSelected(null);
    setEdits({});
    try {
      setOptions(await generateReplyOptions(shown, nextRound));
      setRound(nextRound);
    } catch {
      setDraftFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!review) return;
    setOptions(null);
    setPostFailed(false);
    generate(0);
  }, [review?.id]); // Draft afresh each time the sheet opens for a review.

  const textOf = (i: number) => edits[i] ?? options?.[i]?.text ?? '';
  const chosen = selected !== null ? textOf(selected).trim() : '';
  const canPost = chosen.length > 0 && !loading && !posting;

  const post = async () => {
    if (!canPost || !shown) return;
    setPosting(true);
    setPostFailed(false);
    try {
      await postReply(shown.id, chosen);
      onPosted(chosen);
    } catch {
      setPostFailed(true);
    } finally {
      setPosting(false);
    }
  };

  const avatar = shown ? (AVATAR_COLORS[shown.initials] ?? { fg: colors.white, bg: colors.primaryAccent }) : null;

  return (
    <Sheet visible={!!review} onClose={onClose} heightRatio={0.92} accessibilityLabel="Reply with AI">
      <SheetGrabber bottom={2} />
      {shown && avatar ? (
        <>
          {/* The review is the sheet's header. */}
          <View style={styles.header}>
            <View style={[layout.row, { alignItems: 'flex-start', gap: 12 }]}>
              <Avatar initials={shown.initials} size={38} fontSize={13} background={avatar.bg} color={avatar.fg} />
              <View style={layout.flex1}>
                <Text size={type.headline} weight={700} color={colors.textPrimary} accessibilityRole="header">
                  {shown.name}
                </Text>
                <View style={[layout.row, { marginTop: 1 }]} accessibilityLabel={`${shown.rating} out of 5 stars, ${shown.time}`}>
                  <Text size={type.footnote} color={colors.starAmber}>
                    {'★'.repeat(shown.rating)}
                  </Text>
                  <Text size={type.footnote} color={colors.starAmberEmpty}>
                    {'★'.repeat(5 - shown.rating)}
                  </Text>
                  <Text size={type.footnote} color={colors.textTertiary} style={{ marginLeft: 6 }}>
                    · Google · {shown.time}
                  </Text>
                </View>
              </View>
              <SheetCloseButton onPress={onClose} />
            </View>
            <Text size={type.callout} color={colors.textPrimary} numberOfLines={4} style={{ marginTop: 10 }}>
              {shown.text}
            </Text>
          </View>

          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.listHead}>
              <View style={[layout.row, { gap: 6, flexShrink: 1 }]}>
                <AiSparkGlyph />
                <Text size={type.subhead} weight={700} color={colors.primaryDeep}>
                  {loading ? 'Writing 3 replies…' : 'Pick a reply'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Regenerate replies"
                onPress={() => generate(round + 1)}
                disabled={loading || posting}
                hitSlop={8}
                style={[styles.regenerate, (loading || posting) && { opacity: 0.4 }]}
              >
                <RefreshCw size={13} color={colors.primaryAccent} strokeWidth={2.4} />
                <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
                  Regenerate
                </Text>
              </Pressable>
            </View>
            {!loading && options ? (
              <Text size={type.footnote} color={colors.textTertiary} style={{ marginBottom: 12 }}>
                Tap one to choose it, then edit anything before posting.
              </Text>
            ) : null}

            {loading ? (
              <View style={{ gap: 10, marginTop: 12 }}>
                <OptionSkeleton />
                <OptionSkeleton />
                <OptionSkeleton />
              </View>
            ) : draftFailed ? (
              <View style={styles.failed}>
                <Text size={type.callout} color={colors.textSecondary} align="center">
                  We couldn't write replies right now.
                </Text>
                <Button label="Try again" variant="outline" height={40} fontSize={type.subhead} onPress={() => generate(round)} style={{ alignSelf: 'center', marginTop: 12, paddingHorizontal: 22 }} />
              </View>
            ) : (
              <View style={{ gap: 10 }} accessibilityRole="radiogroup">
                {options?.map((o, i) => {
                  const on = selected === i;
                  const edited = edits[i] !== undefined && edits[i].trim() !== o.text.trim();
                  const head = (
                    <View style={styles.optionHead}>
                      <View style={[layout.row, { gap: 8 }]}>
                        <RadioDot selected={on} />
                        <View style={[styles.tone, on && styles.toneOn]}>
                          <Text size={type.caption} weight={700} color={on ? colors.primaryAccent : colors.textSecondary} lineHeight={1.2}>
                            {o.label}
                          </Text>
                        </View>
                        {edited ? (
                          <Text size={type.caption} weight={600} color={colors.textTertiary}>
                            Edited
                          </Text>
                        ) : null}
                      </View>
                      {on ? (
                        <Text size={type.caption} color={colors.textTertiary}>
                          {textOf(i).length}/{REPLY_MAX}
                        </Text>
                      ) : null}
                    </View>
                  );
                  return on ? (
                    <View key={o.tone} style={[styles.option, styles.optionOn]} accessibilityState={{ selected: true }}>
                      {head}
                      <TextInput
                        accessibilityLabel={`${o.label} reply, editable`}
                        value={textOf(i)}
                        onChangeText={(t) => setEdits((e) => ({ ...e, [i]: t.slice(0, REPLY_MAX) }))}
                        maxLength={REPLY_MAX}
                        multiline
                        textAlignVertical="top"
                        style={styles.input}
                      />
                    </View>
                  ) : (
                    <Pressable
                      key={o.tone}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: false }}
                      accessibilityLabel={`${o.label} reply: ${textOf(i)}`}
                      onPress={() => setSelected(i)}
                      style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.surfaceBase }]}
                    >
                      {head}
                      <Text size={type.callout} color={colors.textSecondary} style={{ marginTop: 8 }}>
                        {textOf(i)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>

          <SheetFooter>
            {postFailed ? (
              <Text size={type.footnote} color={colors.error} style={{ marginBottom: 8 }} accessibilityRole="alert">
                We couldn't post your reply. Check your connection and try again.
              </Text>
            ) : null}
            <Button
              label={postFailed ? 'Try again' : editing ? 'Update reply' : 'Post reply'}
              disabled={!canPost}
              loading={posting}
              onPress={post}
              iconLeft={<Send size={16} color={canPost ? colors.white : colors.textTertiary} strokeWidth={2.2} />}
            />
            <Text size={type.caption} color={colors.textTertiary} align="center" style={{ marginTop: 8 }}>
              {selected === null && !loading ? 'Pick a reply to post it. ' : ''}Replies show publicly on Google.
            </Text>
          </SheetFooter>
        </>
      ) : null}
    </Sheet>
  );
}

/** A placeholder option card with a slow pulse while the AI writes (still with reduced motion). */
function OptionSkeleton() {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, easing: motion.easeOut, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 600, easing: motion.easeOut, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, pulse]);
  return (
    <Animated.View style={[styles.option, { opacity: pulse, gap: 10 }]}>
      <View style={[styles.line, { width: 70, height: 14 }]} />
      <View style={[styles.line, { width: '94%' }]} />
      <View style={[styles.line, { width: '70%' }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 },
  regenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
  },
  option: {
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceElevated,
  },
  optionOn: { borderColor: colors.primaryAccent, backgroundColor: colors.unreadTint },
  optionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  tone: { height: 22, paddingHorizontal: 8, borderRadius: radius.full, backgroundColor: colors.surfaceBase, justifyContent: 'center' },
  toneOn: { backgroundColor: colors.blue50 },
  input: {
    marginTop: 10,
    minHeight: 96,
    padding: 12,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    backgroundColor: colors.white,
    fontFamily: fontFamily(400),
    fontSize: type.callout,
    lineHeight: type.callout * 1.45,
    color: colors.textPrimary,
    outlineStyle: 'none',
  } as object,
  failed: { paddingVertical: 28 },
  line: { height: 10, borderRadius: radius.full, backgroundColor: colors.indigo50 },
});
