export type FieldType = "text" | "textarea" | "date" | "number" | "chips" | "status" | "image";

export type FieldSpec = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  half?: boolean;
  hint?: string;
};

export type TableSpec = {
  table: ProfileTable;
  label: string;
  singular: string;
  description: string;
  titleKey: string;
  subtitleKeys: string[];
  columns: string[];
  fields: FieldSpec[];
};

export type ProfileTable =
  | "experience"
  | "skills"
  | "certifications"
  | "awards"
  | "publications"
  | "testimonials";

const STATUS: FieldSpec = { key: "status", label: "Status", type: "status", half: true };

export const PROFILE_TABLES: Record<ProfileTable, TableSpec> = {
  experience: {
    table: "experience",
    label: "Experience",
    singular: "role",
    description: "Roles, employment history and what you achieved.",
    titleKey: "role",
    subtitleKeys: ["organization", "employment_type"],
    columns: [
      "organization", "role", "employment_type", "start_date", "end_date", "description",
      "responsibilities", "achievements", "skills_gained", "logo_url", "display_order", "status",
    ],
    fields: [
      { key: "role", label: "Role / title", type: "text", half: true, placeholder: "Product Manager" },
      { key: "organization", label: "Organization", type: "text", half: true, placeholder: "Acme Inc." },
      { key: "employment_type", label: "Employment type", type: "text", half: true, placeholder: "Full-time" },
      { key: "logo_url", label: "Logo", type: "image", half: true },
      { key: "start_date", label: "Start date", type: "date", half: true },
      { key: "end_date", label: "End date", type: "date", half: true, hint: "Leave empty if current" },
      { key: "description", label: "Summary", type: "textarea" },
      { key: "responsibilities", label: "Responsibilities", type: "chips" },
      { key: "achievements", label: "Achievements", type: "chips" },
      { key: "skills_gained", label: "Skills gained", type: "chips" },
      STATUS,
      { key: "display_order", label: "Order", type: "number", half: true },
    ],
  },
  skills: {
    table: "skills",
    label: "Skills",
    singular: "skill",
    description: "Capabilities grouped by category with proficiency.",
    titleKey: "name",
    subtitleKeys: ["category"],
    columns: ["name", "category", "description", "proficiency", "icon_url", "display_order"],
    fields: [
      { key: "name", label: "Skill", type: "text", half: true, placeholder: "Product discovery" },
      { key: "category", label: "Category", type: "text", half: true, placeholder: "Product" },
      { key: "proficiency", label: "Proficiency (0-100)", type: "number", half: true },
      { key: "icon_url", label: "Icon", type: "image", half: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "display_order", label: "Order", type: "number", half: true },
    ],
  },
  certifications: {
    table: "certifications",
    label: "Certifications",
    singular: "certification",
    description: "Credentials that back up your expertise.",
    titleKey: "name",
    subtitleKeys: ["issuer"],
    columns: [
      "name", "issuer", "issued_on", "expires_on", "credential_id", "credential_url",
      "description", "image_url", "display_order", "status",
    ],
    fields: [
      { key: "name", label: "Certification", type: "text", half: true },
      { key: "issuer", label: "Issuer", type: "text", half: true },
      { key: "issued_on", label: "Issued on", type: "date", half: true },
      { key: "expires_on", label: "Expires on", type: "date", half: true },
      { key: "credential_id", label: "Credential ID", type: "text", half: true },
      { key: "credential_url", label: "Credential URL", type: "text", half: true },
      { key: "image_url", label: "Badge image", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      STATUS,
      { key: "display_order", label: "Order", type: "number", half: true },
    ],
  },
  awards: {
    table: "awards",
    label: "Awards",
    singular: "award",
    description: "Recognition and honours you have received.",
    titleKey: "title",
    subtitleKeys: ["organization"],
    columns: [
      "title", "organization", "awarded_on", "description", "image_url", "link", "display_order", "status",
    ],
    fields: [
      { key: "title", label: "Award", type: "text", half: true },
      { key: "organization", label: "Awarded by", type: "text", half: true },
      { key: "awarded_on", label: "Date", type: "date", half: true },
      { key: "link", label: "Link", type: "text", half: true },
      { key: "image_url", label: "Image", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      STATUS,
      { key: "display_order", label: "Order", type: "number", half: true },
    ],
  },
  publications: {
    table: "publications",
    label: "Publications",
    singular: "publication",
    description: "Articles, papers, talks and press features.",
    titleKey: "title",
    subtitleKeys: ["outlet", "kind"],
    columns: [
      "title", "kind", "outlet", "published_on", "description", "url", "image_url", "display_order", "status",
    ],
    fields: [
      { key: "title", label: "Title", type: "text", half: true },
      { key: "kind", label: "Type", type: "text", half: true, placeholder: "article, paper, talk, press" },
      { key: "outlet", label: "Outlet", type: "text", half: true },
      { key: "published_on", label: "Published on", type: "date", half: true },
      { key: "url", label: "Link", type: "text" },
      { key: "image_url", label: "Cover image", type: "image" },
      { key: "description", label: "Description", type: "textarea" },
      STATUS,
      { key: "display_order", label: "Order", type: "number", half: true },
    ],
  },
  testimonials: {
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    description: "Social proof from people you have worked with.",
    titleKey: "name",
    subtitleKeys: ["role", "company"],
    columns: [
      "name", "role", "company", "quote", "relationship", "rating", "image_url", "display_order",
    ],
    fields: [
      { key: "name", label: "Name", type: "text", half: true },
      { key: "role", label: "Role", type: "text", half: true },
      { key: "company", label: "Company", type: "text", half: true },
      { key: "rating", label: "Rating (1-5)", type: "number", half: true },
      { key: "relationship", label: "Relationship", type: "text", half: true, placeholder: "Manager, client…" },
      { key: "image_url", label: "Photo", type: "image", half: true },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "display_order", label: "Order", type: "number", half: true },
    ],
  },
};

export const REQUIRED_KEYS: Record<ProfileTable, string[]> = {
  experience: ["role", "organization"],
  skills: ["name"],
  certifications: ["name", "issuer"],
  awards: ["title"],
  publications: ["title", "kind"],
  testimonials: ["name", "quote"],
};
