export type BasicDetails = {
  customerName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  source: string;
};

export type EnquiryState = {
  basics: BasicDetails;
  packageId: string;
  slotId: string;
  platePackageId: string;
  menuItemIds: string[];
  decorIds: string[];
  stageId: string;
  chairId: string;
  extraIds: string[];
  venueId: string;
  discountPercent: number;
  notes: string;
};

export const initialEnquiry: EnquiryState = {
  basics: {
    customerName: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: 100,
    source: "",
  },
  packageId: "",
  slotId: "",
  platePackageId: "",
  menuItemIds: [],
  decorIds: [],
  stageId: "s0",
  chairId: "c1",
  extraIds: [],
  venueId: "v1",
  discountPercent: 0,
  notes: "",
};