import { useEffect, useRef, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AlarmClock, Check, Link2, PhoneCall, MapPin, Pencil, Phone, ShoppingBag } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { layout } from '@/components/primitives';
import { Sheet, SheetFooter, SheetGrabber, SheetHeader } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import type { LeadStatus } from '@/data/leads';
import { currentCycle, leadJourney, type CallLog, type JourneyStep } from '@/lib/calls';
import { dialableNumber, leadPresentation } from '@/lib/leads';
import { CallOutcomeDialog, type CallNote } from '@/sheets/lead-details/CallOutcomeDialog';
import { CustomerHistory } from '@/sheets/lead-details/CustomerHistory';
import { LeadNotesSection } from '@/sheets/lead-details/LeadNotesSection';
import { StatusPill, StatusSelect } from '@/sheets/lead-details/StatusField';
import { useAppStore, useLeadCalls, useLeadNotes, useLeads, useRoleConfig } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, shadows, type } from '@/theme/tokens';

/**
 * Lead details: name (added or edited), masked number for missed calls,
 * source and location, status, a next-day reminder, versioned notes and the
 * customer's history, with "Call back" and "Request review" in a sticky bar
 * at the bottom. Everything saves as it changes: status and reminder straight
 * away, the name when editing ends or the sheet closes. "Call back" dials the
 * customer and asks what happened on the call; the call note goes to Customer
 * history. If the status changed, quick feedback is offered once the sheet
 * closes.
 */
export function LeadDetailSheet() {
  const leadId = useAppStore((s) => s.leadDetailId);
  const close = useAppStore((s) => s.closeLeadDetail);
  const save = useAppStore((s) => s.saveLeadEdits);
  const openAddLead = useAppStore((s) => s.openAddLead);
  const setLeadNotes = useAppStore((s) => s.setLeadNotes);
  const saveLeadCall = useAppStore((s) => s.saveLeadCall);
  const openFeedback = useAppStore((s) => s.openFeedback);
  const { user } = useRoleConfig();
  const current = useLeads().find((l) => l.id === leadId);
  // Keep rendering the last lead while the sheet animates closed.
  const lastLead = useRef(current);
  if (current) lastLead.current = current;
  const lead = current ?? lastLead.current;
  const notes = useLeadNotes(lead?.id ?? null);
  const calls = useLeadCalls(lead?.id ?? null);

  const [name, setName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [status, setStatus] = useState<LeadStatus>('Missed');
  const [statusOpen, setStatusOpen] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  // What the call note dialog opens with, and the call it edits (if any).
  const [callTarget, setCallTarget] = useState<{ initial: { notes?: string }; log?: CallLog }>({
    initial: {},
  });
  const [callLogged, setCallLogged] = useState<{ status?: LeadStatus } | null>(null);
  // Status when the sheet opened, to offer quick feedback on close if it changed.
  const openedStatus = useRef<LeadStatus | null>(null);

  useEffect(() => {
    if (!lead) return;
    setName(lead.person ?? '');
    setEditingName(false);
    setStatus(lead.status);
    openedStatus.current = lead.status;
    setStatusOpen(false);
    setReminder(!!lead.reminder);
    setCallOpen(false);
    setCallLogged(null);
  }, [leadId]); // Reset the draft only when a lead is opened.

  const p = lead ? leadPresentation(lead) : null;
  const steps = lead ? leadJourney(lead, calls) : [];

  const changeStatus = (next: LeadStatus) => {
    setStatus(next);
    if (lead) save(lead.id, { status: next });
  };
  const changeReminder = (on: boolean) => {
    setReminder(on);
    if (lead) save(lead.id, { reminder: on });
  };
  const saveName = () => {
    if (!lead) return;
    const trimmed = name.trim() || undefined;
    if (trimmed !== lead.person) save(lead.id, { name: trimmed });
    setEditingName(false);
  };
  const closeSheet = ({ askFeedback = true } = {}) => {
    saveName();
    close();
    // A status change is a completed task: offer optional quick feedback once the sheet has closed.
    if (askFeedback && openedStatus.current && status !== openedStatus.current) {
      setTimeout(() => openFeedback('status_update'), 400);
    }
  };

  const callBack = () => {
    if (!lead) return;
    // The phone app takes over on a device; the call log is waiting on return.
    // The web preview has no dialer, so it goes straight to the call log.
    if (Platform.OS !== 'web') Linking.openURL(`tel:${dialableNumber(lead.number).replace(/\s/g, '')}`).catch(() => {});
    setCallTarget({ initial: {} });
    setCallOpen(true);
  };

  const addNote = (step: JourneyStep) => {
    const log = step.log;
    setCallTarget(
      log
        ? { initial: { notes: log.notes }, log }
        : { initial: {} },
    );
    setCallOpen(true);
  };

  const logCall = ({ notes: callNotes }: CallNote) => {
    if (!lead) return;
    const existing = callTarget.log;
    saveLeadCall(lead.id, {
      id: existing?.id ?? `call-${Date.now()}`,
      cycle: existing?.cycle ?? currentCycle(lead),
      by: 'store_manager',
      outcome: existing?.outcome,
      notes: callNotes,
      when: existing?.when ?? 'Just now',
      author: existing?.author ?? user.name,
    });
    // A new call moves the lead to "Called by store manager", unless it is already converted.
    const changes = !existing && status !== 'Converted' && status !== 'Called by store manager' ? 'Called by store manager' : undefined;
    if (changes) changeStatus(changes);
    setCallLogged({ status: changes });
    setCallOpen(false);
  };
  const hasName = !!lead?.person;

  return (
    <Sheet visible={!!current} onClose={() => closeSheet()} maxHeightRatio={0.94} accessibilityLabel="Lead details">
      <SheetGrabber bottom={4} />
      <SheetHeader
        title="Lead details"
        onClose={() => closeSheet()}
        paddingX={22}
        topPadding={2}
        accessory={lead ? <StatusPill status={status} /> : null}
      />
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
                onBlur={saveName}
                onSubmitEditing={saveName}
                returnKeyType="done"
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

            <Text size={type.subhead} weight={600} color={colors.textSecondary} style={styles.statusLabel}>
              Status
            </Text>
            <StatusSelect
              value={status}
              open={statusOpen}
              onToggle={() => setStatusOpen((o) => !o)}
              onChange={(s) => {
                changeStatus(s);
                setStatusOpen(false);
              }}
            />

            {callLogged ? (
              <View style={styles.callLogged} accessibilityLiveRegion="polite">
                <View style={styles.callLoggedIcon}>
                  <PhoneCall size={16} color={colors.primaryAccent} strokeWidth={2.2} />
                </View>
                <View style={layout.flex1}>
                  <Text size={type.callout} weight={700} color={colors.textPrimary}>
                    Call note saved
                  </Text>
                  <Text size={type.footnote} color={colors.textSecondary} style={{ marginTop: 1 }}>
                    {callLogged.status
                      ? `Added to customer history. Status set to ${callLogged.status}.`
                      : 'Added to customer history below.'}
                  </Text>
                </View>
              </View>
            ) : null}

            <View style={{ height: 16 }} />
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
                <Pressable accessibilityRole="button" accessibilityLabel="Cancel reminder" onPress={() => changeReminder(false)} hitSlop={10}>
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
                onPress={() => changeReminder(true)}
              />
            )}

            <LeadNotesSection
              key={lead.id}
              notes={notes}
              onChange={(next) => setLeadNotes(lead.id, next)}
              author={user.name}
            />

            <CustomerHistory steps={steps} onAddNote={addNote} />
          </ScrollView>
          <SheetFooter divider={false} style={styles.stickyBar}>
            <View style={[layout.row, { gap: 10 }]}>
              <Button
                label="Call back"
                height={48}
                fontSize={type.subhead}
                style={layout.flex1}
                iconLeft={<Phone size={16} color={colors.white} strokeWidth={2} />}
                onPress={callBack}
              />
              <Button
                label="Request review"
                variant="outlineAccent"
                height={48}
                fontSize={type.subhead}
                style={[layout.flex1, { backgroundColor: colors.white }]}
                iconLeft={<Link2 size={16} color={colors.primaryAccent} strokeWidth={2} />}
                onPress={() => {
                  closeSheet({ askFeedback: false });
                  openAddLead('review');
                }}
              />
            </View>
          </SheetFooter>
          <CallOutcomeDialog
            visible={callOpen}
            number={p.number}
            initial={callTarget.initial}
            onDismiss={() => setCallOpen(false)}
            onSave={logCall}
          />
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
  body: { paddingTop: 16, paddingHorizontal: 22, paddingBottom: 24 },
  stickyBar: { backgroundColor: colors.surfaceElevated, boxShadow: shadows.sheet },
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
  statusLabel: { marginTop: 20, marginBottom: 8 },
  callLogged: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginTop: 16,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.input,
  },
  callLoggedIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
