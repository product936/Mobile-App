import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AlarmClock, Check, Link2, MapPin, Pencil, Phone, ShoppingBag } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/controls';
import { NotesField } from '@/components/fields';
import { layout } from '@/components/primitives';
import { Sheet, SheetFooter, SheetGrabber, SheetHeader } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import { EDITABLE_LEAD_STATUSES, type LeadStatus } from '@/data/leads';
import { dialableNumber, leadPresentation } from '@/lib/leads';
import { useAppStore, useLeads } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, type } from '@/theme/tokens';

/**
 * Lead details: name (added or edited), masked number for missed calls,
 * source and location, status, quick actions, a next-day reminder and notes.
 * Changes are kept as a draft and saved with "Save & Done".
 */
export function LeadDetailSheet() {
  const leadId = useAppStore((s) => s.leadDetailId);
  const close = useAppStore((s) => s.closeLeadDetail);
  const save = useAppStore((s) => s.saveLeadEdits);
  const openAddLead = useAppStore((s) => s.openAddLead);
  const current = useLeads().find((l) => l.id === leadId);
  // Keep rendering the last lead while the sheet animates closed.
  const lastLead = useRef(current);
  if (current) lastLead.current = current;
  const lead = current ?? lastLead.current;

  const [name, setName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [status, setStatus] = useState<LeadStatus>('Missed');
  const [reminder, setReminder] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!lead) return;
    setName(lead.person ?? '');
    setEditingName(false);
    setStatus(lead.status);
    setReminder(!!lead.reminder);
    setNote(lead.note ?? '');
  }, [leadId]); // Reset the draft only when a lead is opened.

  const p = lead ? leadPresentation(lead) : null;
  const hasName = !!lead?.person;

  return (
    <Sheet visible={!!current} onClose={close} maxHeightRatio={0.94} accessibilityLabel="Lead details">
      <SheetGrabber bottom={4} />
      <SheetHeader title="Lead details" onClose={close} paddingX={22} topPadding={2} />
      {lead && p ? (
        <>
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {hasName && !editingName ? (
              <View style={[layout.row, { gap: 8 }]}>
                <Text size={type.title2} weight={700} color={colors.textPrimary}>
                  {name}
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Edit name" onPress={() => setEditingName(true)} style={styles.edit}>
                  <Pencil size={14} color={colors.primaryAccent} strokeWidth={2} />
                </Pressable>
              </View>
            ) : (
              <TextInput
                accessibilityLabel="Customer name"
                value={name}
                onChangeText={setName}
                placeholder="Add customer name"
                placeholderTextColor={colors.textTertiary}
                autoFocus={editingName}
                style={styles.nameInput}
              />
            )}
            <View style={[layout.row, { gap: 8, marginTop: 4 }]}>
              <Phone size={16} color={colors.primaryAccent} strokeWidth={2} />
              <Text size={type.headline} weight={600} color={colors.textSecondary}>
                {p.number}
              </Text>
            </View>

            <View style={styles.metaChips}>
              <MetaChip icon={<ShoppingBag size={13} color={colors.textTertiary} strokeWidth={2} />} label={lead.source} />
              <MetaChip icon={<MapPin size={13} color={colors.textTertiary} strokeWidth={2} />} label={STORE.locationShort} truncate />
            </View>

            <Text size={type.subhead} weight={700} color={colors.textSecondary} style={styles.sectionLabel}>
              Status
            </Text>
            <View style={styles.chips}>
              {EDITABLE_LEAD_STATUSES.map((s) => (
                <Chip key={s} label={s} selected={s === status} onPress={() => setStatus(s)} />
              ))}
            </View>

            <View style={[layout.row, { gap: 10, marginTop: 20 }]}>
              <Button
                label="Call back"
                height={46}
                fontSize={type.subhead}
                style={layout.flex1}
                iconLeft={<Phone size={16} color={colors.white} strokeWidth={2} />}
                onPress={() => Linking.openURL(`tel:${dialableNumber(lead.number).replace(/\s/g, '')}`)}
              />
              <Button
                label="Request review"
                variant="outlineAccent"
                height={46}
                fontSize={type.subhead}
                style={layout.flex1}
                iconLeft={<Link2 size={16} color={colors.primaryAccent} strokeWidth={2} />}
                onPress={() => {
                  close();
                  openAddLead('review');
                }}
              />
            </View>

            <View style={{ height: 12 }} />
            {reminder ? (
              <View style={styles.reminder} accessibilityLiveRegion="polite">
                <View style={styles.reminderIcon}>
                  <Check size={18} color={colors.success} strokeWidth={2.6} />
                </View>
                <View style={layout.flex1}>
                  <Text size={type.callout} weight={700} color={colors.textPrimary}>
                    Reminder set
                  </Text>
                  <Text size={type.footnote} color={colors.textSecondary} style={{ marginTop: 1 }}>
                    We'll nudge you tomorrow at 9:00 AM to follow up.
                  </Text>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Cancel reminder" onPress={() => setReminder(false)} hitSlop={10}>
                  <Text size={type.footnote} weight={700} color={colors.error}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Button
                label="Remind me tomorrow"
                variant="muted"
                height={46}
                fontSize={type.subhead}
                textColor={colors.textPrimary}
                iconLeft={<AlarmClock size={17} color={colors.primaryAccent} strokeWidth={2} />}
                onPress={() => setReminder(true)}
              />
            )}

            <Text size={type.subhead} weight={700} color={colors.textSecondary} style={styles.sectionLabel}>
              Notes
            </Text>
            <NotesField value={note} onChangeText={setNote} placeholder="Add a note about this lead…" accessibilityLabel="Notes" />
          </ScrollView>
          <SheetFooter>
            <Button
              label="Save & Done"
              onPress={() => {
                save(lead.id, { name: name.trim() || undefined, status, reminder, note });
                close();
              }}
            />
          </SheetFooter>
        </>
      ) : null}
    </Sheet>
  );
}

function MetaChip({ icon, label, truncate }: { icon: React.ReactNode; label: string; truncate?: boolean }) {
  return (
    <View style={[styles.metaChip, truncate && { maxWidth: 230 }]}>
      {icon}
      <Text size={type.subhead} weight={600} color={colors.textSecondary} numberOfLines={1} style={{ flexShrink: 1 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: 16, paddingHorizontal: 22, paddingBottom: 20 },
  edit: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    padding: 0,
    fontFamily: fontFamily(700),
    fontSize: type.title2,
    color: colors.textPrimary,
    outlineStyle: 'none',
  } as object,
  metaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  sectionLabel: { marginTop: 20, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: radius.input,
  },
  reminderIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
