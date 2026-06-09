import { AppShell } from "@/components/layout/AppShell";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { useT } from "@/i18n";

const EnquiryPage = () => {
  const { t } = useT();
  return (
    <AppShell title={t("module.enquiry.title")} subtitle={t("module.enquiry.subtitle")}>
      <EnquiryForm variant="enquiry" />
    </AppShell>
  );
};

export default EnquiryPage;
