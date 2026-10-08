import { DATE_RANGES } from '@/data/content';
import { LEAD_SOURCE_FILTERS, LEAD_STATUS_FILTERS } from '@/data/leads';
import { AddLeadSheet } from '@/sheets/AddLeadSheet';
import { LeadDetailSheet } from '@/sheets/LeadDetailSheet';
import { LocationSheet } from '@/sheets/LocationSheet';
import { RadioSheet } from '@/sheets/RadioSheet';
import { ReviewFilterSheet } from '@/sheets/ReviewFilterSheet';
import { DeleteReplyDialog, SupportSheet, UploadSheet } from '@/sheets/SmallSheets';
import { useAppStore } from '@/state/store';

/** Every sheet and dialog in the signed-in app, driven by the store. */
export function GlobalSheets() {
  const sheet = useAppStore((s) => s.sheet);
  const close = useAppStore((s) => s.closeSheet);
  const dateRange = useAppStore((s) => s.dateRange);
  const setDateRange = useAppStore((s) => s.setDateRange);
  const leadStatus = useAppStore((s) => s.leadStatus);
  const setLeadStatus = useAppStore((s) => s.setLeadStatus);
  const leadSource = useAppStore((s) => s.leadSource);
  const setLeadSource = useAppStore((s) => s.setLeadSource);

  return (
    <>
      <LocationSheet />
      <RadioSheet title="Date range" visible={sheet === 'date'} onClose={close} options={DATE_RANGES} value={dateRange} onSelect={setDateRange} />
      <RadioSheet title="Source" visible={sheet === 'source'} onClose={close} options={LEAD_SOURCE_FILTERS} value={leadSource} onSelect={setLeadSource} />
      <RadioSheet
        title="Status"
        visible={sheet === 'status'}
        onClose={close}
        options={LEAD_STATUS_FILTERS}
        value={leadStatus}
        onSelect={setLeadStatus}
        maxHeightRatio={0.8}
      />
      <ReviewFilterSheet />
      <LeadDetailSheet />
      <AddLeadSheet />
      <SupportSheet />
      <UploadSheet />
      <DeleteReplyDialog />
    </>
  );
}
