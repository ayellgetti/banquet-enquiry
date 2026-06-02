import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionCard } from "./SectionCard";
import { SelectableCard } from "./SelectableCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  PACKAGES, MENU_ITEMS, PLATE_PACKAGES, COMMON_PLATE_ITEMS, DECOR_OPTIONS, STAGE_OPTIONS,
  CHAIR_OPTIONS, EXTRA_SERVICES, VENUE_OPTIONS, EVENT_TYPES, SOURCES,
} from "@/data/enquiryOptions";
import { initialEnquiry, type EnquiryState } from "@/types/enquiry";
import { calcTotals, formatINR } from "@/lib/enquiryTotals";
import { ArrowLeft, ArrowRight, Printer, Sparkles } from "lucide-react";
import { toast } from "sonner";

const TAB_ORDER = [
  "basics", "venue", "package", "menu", "decor", "stage", "chair", "extras", "summary",
] as const;
type TabKey = typeof TAB_ORDER[number];

const TAB_LABELS: Record<TabKey, string> = {
  basics: "Basic Details",
  venue: "Venue",
  package: "Package",
  menu: "Menu",
  decor: "Decoration",
  stage: "Stage",
  chair: "Chairs",
  extras: "Extras",
  summary: "Summary",
};

const toggle = (arr: string[], id: string) =>
  arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

export const EnquiryForm = () => {
  const [tab, setTab] = useState<TabKey>("basics");
  const [state, setState] = useState<EnquiryState>(initialEnquiry);
  const totals = calcTotals(state);

  const update = <K extends keyof EnquiryState>(key: K, value: EnquiryState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const updateBasic = <K extends keyof EnquiryState["basics"]>(key: K, value: EnquiryState["basics"][K]) =>
    setState((s) => ({ ...s, basics: { ...s.basics, [key]: value } }));

  const idx = TAB_ORDER.indexOf(tab);
  const canLeave = (from: TabKey): boolean => {
    if (from === "stage" && !state.stageId) {
      toast.error("Please select a stage decoration (Basic Stage Decoration is included by default).");
      return false;
    }
    if (from === "chair" && !state.chairId) {
      toast.error("Please select a chair option.");
      return false;
    }
    if (from === "venue" && !state.venueId) {
      toast.error("Please select a venue.");
      return false;
    }
    return true;
  };
  const tryChangeTab = (next: TabKey) => {
    if (next === tab) return;
    if (!canLeave(tab)) return;
    setTab(next);
  };
  const goNext = () => {
    if (idx < TAB_ORDER.length - 1) tryChangeTab(TAB_ORDER[idx + 1]);
  };
  const goPrev = () => {
    if (idx > 0) tryChangeTab(TAB_ORDER[idx - 1]);
  };

  const menuByCategory = MENU_ITEMS.reduce<Record<string, typeof MENU_ITEMS>>((acc, m) => {
    (acc[m.category] ||= []).push(m);
    return acc;
  }, {});

  const handlePrint = () => {
    if (!state.basics.customerName) {
      toast.error("Please fill customer name before printing.");
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => tryChangeTab(v as TabKey)}>
        <TabsList className="no-print flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          {TAB_ORDER.map((k, i) => (
            <TabsTrigger key={k} value={k} className="text-xs sm:text-sm">
              <span className="mr-1.5 text-muted-foreground">{i + 1}.</span>
              {TAB_LABELS[k]}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* PACKAGE */}
        <TabsContent value="package" className="mt-6">
          <SectionCard title="Choose a Package" description="Hourly rate is set by the selected venue.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(() => {
                const venue = VENUE_OPTIONS.find((v) => v.id === state.venueId);
                const rate = venue?.pricePerHour ?? 0;
                return PACKAGES.map((p) => {
                  const hours = p.slots?.[0]?.hours ?? 0;
                  const label = p.slots?.[0]?.label ?? p.tagline;
                  const subtitle = venue
                    ? `${label} · ${hours}h × ₹${rate.toLocaleString("en-IN")}/hr`
                    : `${label} · select a venue for hourly rate`;
                  return (
                <SelectableCard
                  key={p.id}
                  selected={state.packageId === p.id}
                  onClick={() => update("packageId", p.id)}
                  title={p.name}
                  subtitle={subtitle}
                  price={venue && hours ? `₹${(rate * hours).toLocaleString("en-IN")}` : ""}
                >
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {p.perks.map((perk) => (
                      <li key={perk}>• {perk}</li>
                    ))}
                  </ul>
                </SelectableCard>
                  );
                });
              })()}
            </div>
          </SectionCard>
        </TabsContent>

        {/* BASIC DETAILS */}
        <TabsContent value="basics" className="mt-6">
          <SectionCard title="Basic Details" description="Customer & event information.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer name</Label>
                <Input
                  value={state.basics.customerName}
                  onChange={(e) => updateBasic("customerName", e.target.value.slice(0, 100))}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone number</Label>
                <Input
                  inputMode="tel"
                  value={state.basics.phone}
                  onChange={(e) => updateBasic("phone", e.target.value.replace(/[^\d+\s-]/g, "").slice(0, 20))}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label>Event type</Label>
                <Select value={state.basics.eventType} onValueChange={(v) => updateBasic("eventType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Event date</Label>
                <Input
                  type="date"
                  value={state.basics.eventDate}
                  onChange={(e) => updateBasic("eventDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of guests</Label>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  value={state.basics.guestCount}
                  onChange={(e) => updateBasic("guestCount", Math.max(0, Math.min(10000, Number(e.target.value) || 0)))}
                />
              </div>
              <div className="space-y-2">
                <Label>How did they find us?</Label>
                <Select value={state.basics.source} onValueChange={(v) => updateBasic("source", v)}>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* VENUE */}
        <TabsContent value="venue" className="mt-6">
          <SectionCard title="Venue" description="Pick a venue and the number of booking hours.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VENUE_OPTIONS.map((v) => (
                <SelectableCard
                  key={v.id}
                  selected={state.venueId === v.id}
                  onClick={() => update("venueId", state.venueId === v.id ? "" : v.id)}
                  title={v.name}
                  subtitle={v.description}
                  price={`₹${v.pricePerHour.toLocaleString("en-IN")}/hr`}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* MENU */}
        <TabsContent value="menu" className="mt-6">
          <SectionCard title="Menu Plate" description="Pick a plate package, then choose dishes within the allowed limits.">
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {PLATE_PACKAGES.map((p) => (
                <SelectableCard
                  key={p.id}
                  selected={state.platePackageId === p.id}
                  onClick={() => {
                    update("platePackageId", state.platePackageId === p.id ? "" : p.id);
                    update("menuItemIds", []);
                  }}
                  title={p.name}
                  price={`₹${p.basePrice}/plate`}
                >
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {Object.entries(p.limits).map(([cat, n]) => (
                      <li key={cat}>• {cat} — {n}</li>
                    ))}
                    {p.extras?.map((e) => (
                      <li key={e} className="text-primary">• {e}</li>
                    ))}
                  </ul>
                </SelectableCard>
              ))}
            </div>

            <div className="mb-4 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Included with every plate:</span>{" "}
              {COMMON_PLATE_ITEMS.join(" · ")}
            </div>

            {!state.platePackageId ? (
              <p className="text-sm text-muted-foreground">Select a plate package above to choose dishes.</p>
            ) : (
            <Accordion
              type="single"
              collapsible
              defaultValue={Object.keys(menuByCategory)[0]}
              className="w-full"
            >
              {Object.entries(menuByCategory).map(([cat, items]) => {
                const plate = PLATE_PACKAGES.find((p) => p.id === state.platePackageId);
                const limit = (plate?.limits as Record<string, number> | undefined)?.[cat] ?? 0;
                const selectedItems = items.filter((m) => state.menuItemIds.includes(m.id));
                const selectedCount = selectedItems.length;
                // Cheapest selections fill the included slots; pricier ones are extras.
                const includedIds = new Set(
                  [...selectedItems].sort((a, b) => a.price - b.price).slice(0, limit).map((m) => m.id),
                );
                const extraCount = Math.max(0, selectedCount - limit);
                return (
                  <AccordionItem key={cat} value={cat} className="border-b-0 mb-2 overflow-hidden rounded-lg border bg-white">
                    <AccordionTrigger className="bg-muted/40 px-4 py-3 text-sm font-semibold uppercase tracking-wide hover:no-underline">
                      <span className="flex items-center gap-2">
                        {cat}
                        {limit > 0 ? (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {Math.min(selectedCount, limit)}/{limit} included
                          </span>
                        ) : (
                          selectedCount > 0 && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              {selectedCount} selected
                            </span>
                          )
                        )}
                        {limit > 0 && extraCount > 0 && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            +{extraCount} extra
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white px-4 pb-4">
                      <p className="pt-3 text-xs text-muted-foreground">
                        {limit > 0
                          ? `First ${limit} selection${limit > 1 ? "s" : ""} included in plate price. Any beyond add per-plate cost (lowest-priced fills the included slots).`
                          : "Custom plate — every selected dish is added to the per-plate cost."}
                      </p>
                      <div className="grid gap-3 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((m) => {
                          const isSel = state.menuItemIds.includes(m.id);
                          const isExtra = isSel && !includedIds.has(m.id);
                          return (
                            <SelectableCard
                              key={m.id}
                              selected={isSel}
                              onClick={() => update("menuItemIds", toggle(state.menuItemIds, m.id))}
                              title={m.name}
                              price={isExtra ? `+₹${m.price}/plate (extra)` : `₹${m.price}/plate`}
                              subtitle={isExtra ? "Beyond plate limit — added to per-plate cost" : undefined}
                            />
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            )}
          </SectionCard>
        </TabsContent>

        {/* DECOR */}
        <TabsContent value="decor" className="mt-6">
          <SectionCard title="Decoration" description="Choose decor elements (multi-select).">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DECOR_OPTIONS.map((d) => (
                <SelectableCard
                  key={d.id}
                  selected={state.decorIds.includes(d.id)}
                  onClick={() => update("decorIds", toggle(state.decorIds, d.id))}
                  title={d.name}
                  subtitle={d.description}
                  price={formatINR(d.price)}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* STAGE */}
        <TabsContent value="stage" className="mt-6">
          <SectionCard title="Stage Decoration" description="Pick one stage design.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STAGE_OPTIONS.map((s) => (
                <SelectableCard
                  key={s.id}
                  selected={state.stageId === s.id}
                  onClick={() => update("stageId", state.stageId === s.id ? "" : s.id)}
                  title={s.name}
                  subtitle={s.description}
                  price={formatINR(s.price)}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* CHAIR */}
        <TabsContent value="chair" className="mt-6">
          <SectionCard title="Chairs" description="Seating multiplies by guest count.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CHAIR_OPTIONS.map((c) => (
                <SelectableCard
                  key={c.id}
                  selected={state.chairId === c.id}
                  onClick={() => update("chairId", state.chairId === c.id ? "" : c.id)}
                  title={c.name}
                  price={`₹${c.pricePerUnit}/chair`}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* EXTRAS */}
        <TabsContent value="extras" className="mt-6">
          <SectionCard title="Extra Services" description="Add-ons to round out the event.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXTRA_SERVICES.map((e) => (
                <SelectableCard
                  key={e.id}
                  selected={state.extraIds.includes(e.id)}
                  onClick={() => update("extraIds", toggle(state.extraIds, e.id))}
                  title={e.name}
                  subtitle={e.unit}
                  price={formatINR(e.price)}
                />
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* SUMMARY */}
        <TabsContent value="summary" className="mt-6">
          <SectionCard title="Summary" description="Review everything and apply a discount.">
            <div id="print-area" className="space-y-6">
              <div className="grid gap-4 rounded-lg bg-muted/40 p-4 sm:grid-cols-2">
                <SummaryField label="Customer" value={state.basics.customerName || "—"} />
                <SummaryField label="Phone" value={state.basics.phone || "—"} />
                <SummaryField label="Event" value={state.basics.eventType || "—"} />
                <SummaryField label="Date" value={state.basics.eventDate || "—"} />
                <SummaryField label="Guests" value={String(state.basics.guestCount || 0)} />
                <SummaryField label="Source" value={state.basics.source || "—"} />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Line items
                </h3>
                {totals.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items selected yet.</p>
                ) : (
                  <div className="divide-y rounded-lg border">
                    {totals.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 text-sm">
                        <div>
                          <div className="font-medium text-foreground">{item.label}</div>
                          {item.detail && (
                            <div className="text-xs text-muted-foreground">{item.detail}</div>
                          )}
                        </div>
                        <div className="font-semibold tabular-nums">{formatINR(item.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 no-print">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={state.discountPercent}
                    onChange={(e) => update("discountPercent", Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  />
                </div>
                <div className="space-y-2 no-print">
                  <Label>Internal notes</Label>
                  <Textarea
                    rows={2}
                    value={state.notes}
                    onChange={(e) => update("notes", e.target.value.slice(0, 1000))}
                    placeholder="Anything to remember..."
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-primary/5 p-5">
                <Row label="Subtotal" value={formatINR(totals.subtotal)} />
                <Row
                  label={`Discount (${state.discountPercent}%)`}
                  value={`- ${formatINR(totals.discount)}`}
                />
                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="text-base font-semibold">Grand Total</span>
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    {formatINR(totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Nav controls */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="text-sm">
          <span className="text-muted-foreground">Running total: </span>
          <span className="font-semibold text-foreground">{formatINR(totals.total)}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goPrev} disabled={idx === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {tab === "summary" ? (
            <Button onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" /> Print / Save PDF
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {idx === 0 && !state.packageId && (
        <div className="no-print flex items-start gap-2 rounded-lg border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Tip: pick a package first — it pre-fills pricing across the other sections.
        </div>
      )}
    </div>
  );
};

const SummaryField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="font-medium text-foreground">{value}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);