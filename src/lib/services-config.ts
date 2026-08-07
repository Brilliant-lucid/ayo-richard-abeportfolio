export type ServiceCategory =
  | "consultation"
  | "freelance"
  | "coaching"
  | "mentorship"
  | "training"
  | "workshop"
  | "speaking"
  | "audit"
  | "creative"
  | "technical"
  | "custom";

export type FormKind = "consultation" | "freelance" | "coaching" | "speaking" | "general";

export const SERVICE_CATEGORIES: {
  value: ServiceCategory;
  label: string;
  action: string;
  form: FormKind;
}[] = [
  { value: "consultation", label: "Consultation", action: "Book Consultation", form: "consultation" },
  { value: "freelance", label: "Freelance Service", action: "Request Quote", form: "freelance" },
  { value: "coaching", label: "Coaching", action: "Book Coaching", form: "coaching" },
  { value: "mentorship", label: "Mentorship", action: "Request Mentorship", form: "coaching" },
  { value: "training", label: "Training", action: "Book Training", form: "consultation" },
  { value: "workshop", label: "Workshop", action: "Book Workshop", form: "speaking" },
  { value: "speaking", label: "Speaking Engagement", action: "Invite to Speak", form: "speaking" },
  { value: "audit", label: "Audit or Review", action: "Request Review", form: "freelance" },
  { value: "creative", label: "Creative Services", action: "Request Quote", form: "freelance" },
  { value: "technical", label: "Technical Services", action: "Request Quote", form: "freelance" },
  { value: "custom", label: "Custom Service", action: "Hire Me", form: "general" },
];

const byValue = new Map(SERVICE_CATEGORIES.map((c) => [c.value, c]));

export function categoryLabel(c?: string | null) {
  return byValue.get((c ?? "custom") as ServiceCategory)?.label ?? "Service";
}

export function categoryForm(c?: string | null): FormKind {
  return byValue.get((c ?? "custom") as ServiceCategory)?.form ?? "general";
}

export function defaultAction(c?: string | null) {
  return byValue.get((c ?? "custom") as ServiceCategory)?.action ?? "Hire Me";
}

export type ServiceRow = {
  id: string;
  name: string;
  category: ServiceCategory;
  short_description: string | null;
  detailed_description: string | null;
  cover_image_url: string | null;
  starting_price: number | null;
  currency: string;
  pricing_type: "fixed" | "starting_from" | "custom_quote" | "free";
  duration: string | null;
  delivery_time: string | null;
  location: "online" | "onsite" | "hybrid";
  availability: string | null;
  featured: boolean;
  accepting_requests: boolean;
  action_label: string | null;
  status: "active" | "disabled" | "archived";
  display_order: number;
};

export function actionLabel(s: Pick<ServiceRow, "category" | "action_label">) {
  return s.action_label?.trim() || defaultAction(s.category);
}

export const PRICING_TYPES = [
  { value: "fixed", label: "Fixed Price" },
  { value: "starting_from", label: "Starting From" },
  { value: "custom_quote", label: "Custom Quote" },
  { value: "free", label: "Free" },
] as const;

export const LOCATIONS = [
  { value: "online", label: "Online" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export function priceSummary(s: Pick<ServiceRow, "pricing_type" | "starting_price" | "currency">) {
  const amount =
    s.starting_price != null
      ? `${s.currency || "USD"} ${Number(s.starting_price).toLocaleString()}`
      : null;
  switch (s.pricing_type) {
    case "free":
      return "Free";
    case "custom_quote":
      return "Custom quote";
    case "starting_from":
      return amount ? `From ${amount}` : "Starting from";
    case "fixed":
      return amount ?? "Fixed price";
    default:
      return "";
  }
}

export const LOCATION_LABEL: Record<string, string> = {
  online: "Online",
  onsite: "On-site",
  hybrid: "Hybrid",
};

/** Field spec used to render the tailored inquiry forms. */
export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "email" | "date" | "time" | "textarea" | "number";
  required?: boolean;
  placeholder?: string;
};

export const FORM_SPECS: Record<FormKind, { title: string; submit: string; fields: FieldSpec[] }> = {
  consultation: {
    title: "Book a consultation",
    submit: "Book Session",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "preferred_date", label: "Preferred date", type: "date" },
      { name: "preferred_time", label: "Preferred time", type: "time" },
      { name: "time_zone", label: "Time zone", placeholder: "e.g. GMT+1" },
      { name: "meeting_platform", label: "Meeting platform", placeholder: "Google Meet, Zoom…" },
      { name: "purpose", label: "Purpose of meeting", type: "textarea", required: true },
    ],
  },
  freelance: {
    title: "Request a quote",
    submit: "Request Quote",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "company", label: "Company (optional)" },
      { name: "project_title", label: "Project title", required: true },
      { name: "budget", label: "Budget", placeholder: "e.g. $2,000 – $5,000" },
      { name: "timeline", label: "Expected timeline", placeholder: "e.g. 6 weeks" },
      { name: "project_description", label: "Project description", type: "textarea", required: true },
    ],
  },
  coaching: {
    title: "Book coaching",
    submit: "Book Coaching",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "goal", label: "Coaching goal", type: "textarea", required: true },
      { name: "preferred_schedule", label: "Preferred schedule", placeholder: "e.g. Weekday evenings" },
      { name: "notes", label: "Additional notes", type: "textarea" },
    ],
  },
  speaking: {
    title: "Speaking invitation",
    submit: "Send Invitation",
    fields: [
      { name: "name", label: "Your name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "organization", label: "Organization", required: true },
      { name: "event_name", label: "Event name", required: true },
      { name: "event_date", label: "Event date", type: "date" },
      { name: "audience_size", label: "Audience size", type: "number" },
      { name: "topic", label: "Speaking topic", required: true },
      { name: "budget", label: "Budget" },
      { name: "notes", label: "Additional information", type: "textarea" },
    ],
  },
  general: {
    title: "General inquiry",
    submit: "Send Message",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "subject", label: "Subject" },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
};
