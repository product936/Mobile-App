import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Send } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { AiSparkGlyph } from '@/components/glyphs';
import { layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import type { Review } from '@/data/content';
import { REPLY_MAX } from '@/lib/reviews';
import { postReply } from '@/services/reviews';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, type } from '@/theme/tokens';

export type ComposerMode = 'write' | 'edit';

/**
 * Inline reply box on a review card, for writing a reply or editing the
 * posted one. "Draft with AI" in its header hands over to the AI options
 * sheet. Nothing is posted until "Post reply".
 */
export function ReplyComposer({
  review,
  mode,
  initialText = '',
  onCancel,
  onPosted,
  onDraftWithAi,
}: {
  review: Review;
  mode: ComposerMode;
  initialText?: string;
  onCancel: () => void;
  onPosted: (text: string) => void;
  onDraftWithAi: () => void;
}) {
  const [text, setText] = useState(initialText);
  const [posting, setPosting] = useState(false);
  const [failed, setFailed] = useState(false);
  const canPost = text.trim().length > 0 && !posting;

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
    <View style={styles.box}>
      <View style={styles.head}>
        <Text size={type.footnote} weight={700} color={colors.textSecondary}>
          {mode === 'edit' ? 'Edit your reply' : 'Your reply'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Draft a reply with AI"
          onPress={onDraftWithAi}
          disabled={posting}
          hitSlop={8}
          style={styles.headAction}
        >
          <AiSparkGlyph size={12} />
          <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
            Draft with AI
          </Text>
        </Pressable>
      </View>

      <TextInput
        accessibilityLabel="Your reply"
        value={text}
        onChangeText={(t) => setText(t.slice(0, REPLY_MAX))}
        maxLength={REPLY_MAX}
        multiline
        textAlignVertical="top"
        autoFocus
        placeholder={`Write a reply to ${review.name.split(' ')[0]}…`}
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
      />

      <View style={[layout.row, { justifyContent: 'space-between', marginTop: 6 }]}>
        <Text size={type.caption} color={colors.textTertiary} style={layout.flex1}>
          Replies show publicly on Google.
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

const styles = StyleSheet.create({
  box: {
    marginTop: 14,
    padding: 12,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceElevated,
  },
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
});
