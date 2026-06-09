import { AppShell } from "@/components/layout/AppShell";
import { ProcurementForm } from "@/components/procurement/ProcurementForm";
import { useT } from "@/i18n";

const ProcurementPage = () => {
  const { t } = useT();
  return (
    <AppShell title={t("module.procurement.title")} subtitle={t("module.procurement.subtitle")}>
      <ProcurementForm />
    </AppShell>
  );
};

export default ProcurementPage;
