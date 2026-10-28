import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { RefreshCw, Send } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { AiSparkGlyph } from '@/components/glyphs';
import { layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import type { Review } from '@/data/content';
import { REPLY_MAX } from '@/lib/reviews';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { generateReplyDraft, postReply } from '@/services/reviews';
import { fontFamily } from '@/theme/fonts';
import { colors, motion, radius, type } from '@/theme/tokens';

export type ComposerMode = 'ai' | 'write' | 'edit';

/**
 * Inline reply box on a review card. "Draft with AI" fills it with an AI
 * draft the user can edit freely before posting; "Regenerate" asks for a new
 * wording. "Reply" and "Edit" open it empty or with the posted reply, with
 * "Draft with AI" still one tap away. Nothing is posted until "Post reply".
 */
export function ReplyComposer({
  review,
  mode,
  initialText = '',
  onCancel,
  onPosted,
}: {
  review: Review;
  mode: ComposerMode;
  initialText?: string;
  onCancel: () => void;
  onPosted: (text: string) => void;
}) {
  const [text, setText] = useState(initialText);
  // The last AI draft, to tell whether the user has edited it.
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [variant, setVariant] = useState(0);
  const [drafting, setDrafting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [failed, setFailed] = useState(false);

  const draft = async (nextVariant: number) => {
    setDrafting(true);
    setFailed(false);
    try {
      const reply = await generateReplyDraft(review, nextVariant);
      setVariant(nextVariant);
      setAiDraft(reply);
      setText(reply);
    } finally {
      setDrafting(false);
    }
  };

  useEffect(() => {
    if (mode === 'ai') draft(0);
  }, []); // Draft once when opened with "Draft with AI".

  const fromAi = aiDraft !== null;
  const edited = fromAi && text.trim() !== aiDraft.trim();
  const canPost = text.trim().length > 0 && !drafting && !posting;

  const post = async () => {
    if (!canPost) return;
    setPosting(true);
    setFailed(false);
    try {
      await postReply(review.id, text.trim());
      onPosted(text.trim());
    } catch {
      setFailed(true);
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={[styles.box, fromAi && styles.boxAi]}>
      <View style={styles.head}>
        {fromAi || drafting ? (
          <View style={[layout.row, { gap: 6, flexShrink: 1 }]}>
            <AiSparkGlyph />
            <Text size={type.footnote} weight={700} color={colors.primaryDeep}>
              {drafting ? 'Drafting a reply…' : edited ? 'AI draft · edited by you' : 'AI draft · tap to edit'}
            </Text>
          </View>
        ) : (
          <Text size={type.footnote} weight={700} color={colors.textSecondary}>
            {mode === 'edit' ? 'Edit your reply' : 'Your reply'}
          </Text>
        )}
        {!drafting ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={fromAi ? 'Regenerate the AI draft' : 'Draft a reply with AI'}
            onPress={() => draft(fromAi ? variant + 1 : 0)}
            disabled={posting}
            hitSlop={8}
            style={styles.headAction}
          >
            {fromAi ? <RefreshCw size={13} color={colors.primaryAccent} strokeWidth={2.4} /> : <AiSparkGlyph size={12} />}
            <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
              {fromAi ? 'Regenerate' : 'Draft with AI'}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {drafting ? (
        <DraftingPlaceholder />
      ) : (
        <TextInput
          accessibilityLabel={fromAi ? 'AI-drafted reply, editable' : 'Your reply'}
          value={text}
          onChangeText={(t) => setText(t.slice(0, REPLY_MAX))}
          maxLength={REPLY_MAX}
          multiline
          textAlignVertical="top"
          autoFocus={mode !== 'ai'}
          placeholder={`Write a reply to ${review.name.split(' ')[0]}…`}
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />
      )}

      <View style={[layout.row, { justifyContent: 'space-between', marginTop: 6 }]}>
        <Text size={type.caption} color={colors.textTertiary} style={layout.flex1}>
          {fromAi && !drafting ? 'Check the draft and edit anything before posting. ' : ''}Replies show publicly on Google.
        </Text>
        <Text size={type.caption} color={colors.textTertiary}>
          {text.length}/{REPLY_MAX}
        </Text>
      </View>

      {failed ? (
        <Text size={type.footnote} color={colors.error} style={{ marginTop: 8 }} accessibilityRole="alert">
          We couldn't post your reply. Check your connection and try again.
        </Text>
      ) : null}

      <View style={[layout.row, { gap: 10, marginTop: 12 }]}>
        <Button label="Cancel" variant="outline" height={42} fontSize={type.subhead} style={{ flex: 38 }} onPress={onCancel} />
        <Button
          label={failed ? 'Try again' : mode === 'edit' ? 'Update reply' : 'Post reply'}
          height={42}
          fontSize={type.subhead}
          disabled={!canPost}
          loading={posting}
          onPress={post}
          style={{ flex: 62, boxShadow: 'none' }}
          iconLeft={<Send size={15} color={canPost ? colors.white : colors.textTertiary} strokeWidth={2.2} />}
        />
      </View>
    </View>
  );
}

/** Three soft lines with a slow pulse while the AI writes (still with reduced motion). */
function DraftingPlaceholder() {
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
    <Animated.View style={[styles.placeholder, { opacity: pulse }]} accessibilityLabel="Drafting a reply with AI">
      <View style={[styles.line, { width: '92%' }]} />
      <View style={[styles.line, { width: '84%' }]} />
      <View style={[styles.line, { width: '58%' }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 14,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceElevated,
  },
  boxAi: { borderColor: colors.infoBorder, backgroundColor: colors.unreadTint },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 },
  headAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  input: {
    minHeight: 104,
    padding: 12,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
    fontFamily: fontFamily(400),
    fontSize: type.callout,
    lineHeight: type.callout * 1.45,
    color: colors.textPrimary,
    outlineStyle: 'none',
  } as object,
  placeholder: {
    minHeight: 104,
    padding: 14,
    gap: 10,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  line: { height: 10, borderRadius: radius.full, backgroundColor: colors.indigo50 },
});
