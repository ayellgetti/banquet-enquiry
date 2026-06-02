import { EnquiryForm } from "@/components/enquiry/EnquiryForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="no-print border-b bg-card">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            New Event Enquiry
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build a complete quote across packages, menu, decor and more.
          </p>
        </div>
      </header>
      <main className="container py-8">
        <EnquiryForm />
      </main>
    </div>
  );
};

export default Index;
