import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ChevronDown, ChevronLeft, Copy, MapPin, ScanLine, Send, UserPlus } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Chip, SegmentedTabs } from '@/components/controls';
import { FieldLabel, NotesField, PhoneField, TextField } from '@/components/fields';
import { QrPlaceholder, WhatsAppGlyph } from '@/components/glyphs';
import { PressableScale } from '@/components/PressableScale';
import { Card, IconTile, layout } from '@/components/primitives';
import { Sheet, SheetCloseButton, SheetFooter, SheetGrabber } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import { PURCHASE_OPTIONS } from '@/data/leads';
import { useAppStore } from '@/state/store';
import { colors, leading, radius, type } from '@/theme/tokens';

const REVIEW_MESSAGE = `Hi Rajesh, thanks for purchasing your Tata Punch with a 10% discount. Vishal was glad to be part of your purchase journey. Your insights help us serve you better, so we invite you to share your experience here: ${STORE.reviewLink}`;

type ShareMode = 'qr' | 'message';

/**
 * "Add a lead" → "Request a review". Saving the form moves the same sheet to
 * the review step; the back arrow returns to the form.
 */
export function AddLeadSheet() {
  const { open, step } = useAppStore((s) => s.addLead);
  const setStep = useAppStore((s) => s.setAddLeadStep);
  const close = useAppStore((s) => s.closeAddLead);

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purchased, setPurchased] = useState<'yes' | 'no' | null>(null);
  const [item, setItem] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [shareMode, setShareMode] = useState<ShareMode>('qr');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPhone('');
    setName('');
    setEmail('');
    setPurchased(null);
    setItem(null);
    setNotes('');
    setShareMode('qr');
    setCopied(false);
  }, [open]);

  const onReview = step === 'review';

  return (
    <Sheet visible={open} onClose={close} heightRatio={0.94} accessibilityLabel={onReview ? 'Request a review' : 'Add a lead'}>
      <SheetGrabber bottom={4} />
      <View style={styles.topBar}>
        {onReview ? (
          <SheetCloseButton onPress={() => setStep('form')} icon={<ChevronLeft size={18} color={colors.textSecondary} strokeWidth={2.2} />} />
        ) : (
          <View style={{ width: 32 }} />
        )}
        <SheetCloseButton onPress={close} />
      </View>

      <ScrollView style={layout.flex1} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {onReview ? (
          <>
            <Text size={type.title1} weight={700} lineHeight={leading.tight} color={colors.textPrimary} accessibilityRole="header">
              Request a review
            </Text>
            <Text size={type.body} color={colors.textSecondary} style={{ marginTop: 6 }}>
              Your store's review link, specific to Vishal
            </Text>
            <View style={{ height: 16 }} />
            <SegmentedTabs
              options={[
                { label: 'QR code', value: 'qr' },
                { label: 'Message', value: 'message' },
              ]}
              value={shareMode}
              onChange={setShareMode}
              style={{ marginBottom: 16 }}
            />
            {shareMode === 'qr' ? (
              <>
                <Card style={{ padding: 18 }}>
                  <View style={[layout.row, { justifyContent: 'center', gap: 8 }]}>
                    <ScanLine size={18} color={colors.primaryAccent} strokeWidth={2} />
                    <Text size={type.headline} weight={700} color={colors.primaryAccent}>
                      Scan to collect review
                    </Text>
                  </View>
                  <View style={{ height: 14 }} />
                  <View style={{ alignItems: 'center' }}>
                    <View style={styles.qrFrame}>
                      <QrPlaceholder size={168} />
                    </View>
                  </View>
                </Card>
                <View style={{ height: 12 }} />
                <View style={styles.linkRow}>
                  <Text size={type.callout} weight={600} color={colors.primaryAccent} numberOfLines={1} style={layout.flex1}>
                    {STORE.reviewLink}
                  </Text>
                  <PressableScale
                    pressedScale={0.94}
                    accessibilityLabel={copied ? 'Link copied' : 'Copy link'}
                    onPress={async () => {
                      await Clipboard.setStringAsync(STORE.reviewLink);
                      setCopied(true);
                    }}
                    style={styles.copy}
                  >
                    <Copy size={16} color={colors.primaryAccent} strokeWidth={2} />
                  </PressableScale>
                </View>
                <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 8 }} accessibilityLiveRegion="polite">
                  {copied ? 'Link copied.' : "Customer feedback link for Vishal's sales"}
                </Text>
              </>
            ) : (
              <>
                <FieldLabel>Message</FieldLabel>
                <View style={styles.message}>
                  <Text size={type.body} color={colors.textSecondary}>
                    {REVIEW_MESSAGE}
                  </Text>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            <View style={[layout.row, { gap: 12 }]}>
              <IconTile size={40}>
                <UserPlus size={20} color={colors.primaryAccent} strokeWidth={2} />
              </IconTile>
              <Text size={type.title1} weight={700} lineHeight={leading.tight} color={colors.textPrimary} accessibilityRole="header">
                Add a lead
              </Text>
            </View>
            <Text size={type.body} color={colors.textSecondary} style={{ marginTop: 8 }}>
              Someone who walked in or was referred — record them so your store can follow up.
            </Text>

            <View style={{ height: 20 }} />
            <Pressable accessibilityRole="button" accessibilityLabel={`Store: ${STORE.locationName}`} style={styles.storeSelect}>
              <MapPin size={18} color={colors.primaryAccent} strokeWidth={2} />
              <Text size={type.callout} weight={600} color={colors.textPrimary} numberOfLines={1} style={layout.flex1}>
                {STORE.locationName}
              </Text>
              <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2.2} />
            </Pressable>

            <View style={{ height: 18 }} />
            <FieldLabel>Mobile number</FieldLabel>
            <PhoneField
              accessibilityLabel="Customer mobile number"
              value={phone}
              onChangeText={(v) => setPhone(v.replace(/\D/g, ''))}
              placeholder="98450 12345"
            />

            <View style={{ height: 16 }} />
            <FieldLabel optional>Full name</FieldLabel>
            <TextField accessibilityLabel="Full name" value={name} onChangeText={setName} placeholder="Rajesh" autoCapitalize="words" />

            <View style={{ height: 16 }} />
            <FieldLabel optional>Email</FieldLabel>
            <TextField
              accessibilityLabel="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="rajesh@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={{ height: 20 }} />
            <Text size={type.subhead} weight={600} color={colors.textSecondary} style={{ marginBottom: 10 }}>
              Did the customer purchase from the store?
            </Text>
            <View style={[layout.row, { gap: 10 }]}>
              {(['yes', 'no'] as const).map((v) => {
                const selected = purchased === v;
                return (
                  <Pressable
                    key={v}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setPurchased(v);
                      setItem(null);
                    }}
                    style={[styles.choice, selected ? styles.choiceOn : styles.choiceOff]}
                  >
                    <Text size={type.headline} weight={600} color={selected ? colors.white : colors.textSecondary} lineHeight={1.2}>
                      {v === 'yes' ? 'Yes' : 'No'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {purchased ? (
              <>
                <View style={{ height: 16 }} />
                <Text size={type.subhead} weight={600} color={colors.textSecondary} style={{ marginBottom: 10 }}>
                  {purchased === 'yes' ? 'What did they purchase?' : 'What are they interested in?'}
                </Text>
                <View style={styles.chips}>
                  {PURCHASE_OPTIONS.map((o) => (
                    <Chip key={o} label={o} selected={item === o} onPress={() => setItem(o)} />
                  ))}
                </View>
              </>
            ) : null}

            <View style={{ height: 20 }} />
            <FieldLabel optional>Notes</FieldLabel>
            <NotesField
              accessibilityLabel="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Share more purchase details about their journey"
            />
          </>
        )}
      </ScrollView>

      <SheetFooter>
        {onReview ? (
          <>
            <Text size={type.subhead} color={colors.textTertiary} style={{ marginBottom: 10 }}>
              Send it on
            </Text>
            <View style={[layout.row, { gap: 10 }]}>
              <Button
                label="WhatsApp"
                variant="whatsapp"
                style={layout.flex1}
                iconLeft={<WhatsAppGlyph />}
                onPress={() => Linking.openURL(`whatsapp://send?text=${encodeURIComponent(shareText(shareMode))}`)}
              />
              <Button
                label="SMS"
                variant="outlineAccent"
                style={layout.flex1}
                iconLeft={<Send size={18} color={colors.primaryAccent} strokeWidth={2} />}
                onPress={() => Linking.openURL(smsUrl(shareText(shareMode)))}
              />
            </View>
          </>
        ) : (
          <Button label="Save & Collect Feedback" onPress={() => setStep('review')} />
        )}
      </SheetFooter>
    </Sheet>
  );
}

function shareText(mode: ShareMode) {
  return mode === 'message' ? REVIEW_MESSAGE : STORE.reviewLink;
}

function smsUrl(body: string) {
  // iOS separates the body with "&", Android with "?".
  return Platform.OS === 'ios' ? `sms:&body=${encodeURIComponent(body)}` : `sms:?body=${encodeURIComponent(body)}`;
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2, paddingHorizontal: 16 },
  body: { paddingTop: 4, paddingHorizontal: 22, paddingBottom: 20 },
  storeSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
  choice: { flex: 1, height: 46, borderRadius: radius.lg, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  choiceOn: { backgroundColor: colors.primaryAccent, borderColor: colors.primaryAccent },
  choiceOff: { backgroundColor: colors.surfaceElevated, borderColor: colors.borderDefault },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  qrFrame: {
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingLeft: 14,
    paddingRight: 6,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.input,
  },
  copy: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    padding: 14,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
});
