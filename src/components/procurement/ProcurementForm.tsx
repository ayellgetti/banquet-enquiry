import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionCard } from "@/components/enquiry/SectionCard";
import { itemsByCategory, PROCUREMENT_CATEGORIES, PROCUREMENT_ITEMS } from "@/data/procurementOptions";
import { initialProcurement, type ProcurementState } from "@/types/procurement";
import { ArrowLeft, ArrowRight, Printer } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/i18n";

const TAB_ORDER = ["materials", "summary"] as const;
type TabKey = typeof TAB_ORDER[number];

const procurementAccordionItemClass =
  "mb-2 overflow-hidden rounded-lg border border-border bg-white last:mb-0";
const procurementAccordionTriggerClass =
  "bg-muted/40 px-4 py-3 text-sm font-semibold uppercase tracking-wide hover:no-underline data-[state=open]:border-b data-[state=open]:border-border";

export const ProcurementForm = () => {
  const { t } = useT();
  const [tab, setTab] = useState<TabKey>("materials");
  const [state, setState] = useState<ProcurementState>(initialProcurement);
  const [attempted, setAttempted] = useState<Set<TabKey>>(new Set());

  const idx = TAB_ORDER.indexOf(tab);

  const validateTab = (key: TabKey): string[] => {
    const errs: string[] = [];
    if (key === "materials") {
      const hasQty = Object.values(state.quantities).some((q) => q > 0);
      if (!hasQty) errs.push(t("procurement.validate.materials"));
    }
    return errs;
  };

  const tryChangeTab = async (next: TabKey) => {
    if (next === tab) return;
    const nextIdx = TAB_ORDER.indexOf(next);
    if (nextIdx < idx) { setTab(next); return; }

    let firstBad: TabKey | null = null;
    const allErrs: string[] = [];
    for (let i = idx; i < nextIdx; i++) {
      const errs = validateTab(TAB_ORDER[i]);
      if (errs.length) {
        firstBad ??= TAB_ORDER[i];
        allErrs.push(...errs);
      }
    }
    if (firstBad) {
      setAttempted((prev) => new Set([...prev, firstBad!]));
      if (firstBad !== tab) setTab(firstBad);
      toast.error(t("toast.fixErrors"), {
        description: (
          <ul className="ml-4 list-disc space-y-0.5 text-white">
            {allErrs.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        ),
      });
      return;
    }

    setTab(next);
  };

  const setQty = (id: string, raw: number) => {
    const qty = Math.max(0, Math.min(9999, raw));
    setState((s) => ({
      ...s,
      quantities: { ...s.quantities, [id]: qty },
    }));
  };

  const selectedItems = Object.entries(state.quantities).filter(([, q]) => q > 0);

  const handleDownloadPdf = async () => {
    if (selectedItems.length === 0) {
      toast.error(t("procurement.validate.materials"));
      return;
    }
    const element = document.getElementById("print-area");
    if (!element) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename = `Procurement_${timestamp}.pdf`;
    try {
      document.body.classList.add("printing");
      const { default: html2pdf } = await import("html2pdf.js");
      await html2pdf()
        .set({
          margin: 10,
          filename,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch {
      toast.error(t("toast.pdfFailed"));
    } finally {
      document.body.classList.remove("printing");
    }
  };

  const summaryByCategory = PROCUREMENT_CATEGORIES.map((cat) => {
    const catItems = selectedItems
      .map(([id, qty]) => {
        const item = PROCUREMENT_ITEMS.find((i) => i.id === id);
        return item?.category === cat ? { item, qty } : null;
      })
      .filter(Boolean) as { item: typeof PROCUREMENT_ITEMS[number]; qty: number }[];
    return { cat, catItems };
  }).filter((g) => g.catItems.length > 0);

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => void tryChangeTab(v as TabKey)}>
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl border border-border/70 bg-card p-1.5 shadow-soft">
          {TAB_ORDER.map((k, i) => (
            <TabsTrigger
              key={k}
              value={k}
              className="gap-1.5 rounded-lg data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground data-[state=active]:shadow-gold"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                {i + 1}
              </span>
              {t(`procurement.tab.${k}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="materials" className="mt-6">
          <SectionCard title={t("procurement.materials.title")} description={t("procurement.materials.desc")} required>
            {attempted.has("materials") && selectedItems.length === 0 && (
              <p className="mb-4 text-sm text-destructive">{t("procurement.validate.materials")}</p>
            )}
            <Accordion type="single" collapsible className="w-full">
              {PROCUREMENT_CATEGORIES.map((cat) => {
                const items = itemsByCategory[cat] ?? [];
                if (!items.length) return null;
                const selectedInCat = items.filter((item) => (state.quantities[item.id] ?? 0) > 0).length;
                return (
                  <AccordionItem key={cat} value={cat} className={procurementAccordionItemClass}>
                    <AccordionTrigger className={procurementAccordionTriggerClass}>
                      <span className="flex flex-1 items-center gap-2 text-left normal-case sm:uppercase">
                        {cat}
                        {selectedInCat > 0 && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium normal-case text-amber-800">
                            {selectedInCat} {t("menu.selected")}
                          </span>
                        )}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white px-0 pb-0 pt-0">
                      <ul className="divide-y">
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-3 px-4 py-3 sm:grid sm:grid-cols-[1fr_5rem_6.5rem] sm:items-center sm:gap-4"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-snug">{item.name}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">{item.unit}</p>
                            </div>
                            <span className="hidden text-sm text-muted-foreground sm:block">{item.unit}</span>
                            <Input
                              type="number"
                              min={0}
                              max={9999}
                              inputMode="numeric"
                              aria-label={`${item.name} ${t("procurement.qty")}`}
                              value={state.quantities[item.id] ?? ""}
                              onChange={(e) => setQty(item.id, Number(e.target.value) || 0)}
                              className="h-9 w-full shrink-0 text-right tabular-nums sm:w-full"
                              placeholder="0"
                            />
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </SectionCard>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <SectionCard title={t("summary.title")} description={t("procurement.summary.desc")}>
            <div id="print-area">
              {selectedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("procurement.noMaterials")}</p>
              ) : (
                <>
                  <div className="no-print">
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue={summaryByCategory[0]?.cat}
                      className="w-full"
                    >
                      {summaryByCategory.map(({ cat, catItems }) => (
                        <AccordionItem key={cat} value={cat} className={procurementAccordionItemClass}>
                          <AccordionTrigger className={procurementAccordionTriggerClass}>
                            <span className="flex-1 text-left">{cat}</span>
                          </AccordionTrigger>
                          <AccordionContent className="bg-white px-0 pb-0 pt-0">
                            <ul className="divide-y px-4">
                              {catItems.map(({ item, qty }) => (
                                <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                                  <span className="min-w-0 font-medium">{item.name}</span>
                                  <span className="shrink-0 tabular-nums text-muted-foreground">
                                    {qty} {item.unit}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                  <div className="print-only space-y-4">
                    <h2 className="font-display text-lg font-semibold">{t("procurement.materials.title")}</h2>
                    {summaryByCategory.map(({ cat, catItems }) => (
                      <div key={cat}>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">{cat}</h3>
                        <ul className="space-y-1 text-sm">
                          {catItems.map(({ item, qty }) => (
                            <li key={item.id} className="flex justify-between gap-4 border-b border-border/50 py-1">
                              <span>{item.name}</span>
                              <span className="tabular-nums">{qty} {item.unit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
        <div />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void tryChangeTab(TAB_ORDER[idx - 1])} disabled={idx === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> {t("common.back")}
          </Button>
          {idx < TAB_ORDER.length - 1 ? (
            <Button
              onClick={() => void tryChangeTab(TAB_ORDER[idx + 1])}
              className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95"
            >
              {t("common.next")} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => void handleDownloadPdf()}
              className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95"
            >
              <Printer className="mr-1 h-4 w-4" /> {t("common.downloadPdf")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
