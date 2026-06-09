import { AppShell } from "@/components/layout/AppShell";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { useT } from "@/i18n";

const MenuSelectionPage = () => {
  const { t } = useT();
  return (
    <AppShell title={t("module.menu.title")} subtitle={t("module.menu.subtitle")}>
      <EnquiryForm variant="menu-selection" />
    </AppShell>
  );
};

export default MenuSelectionPage;
