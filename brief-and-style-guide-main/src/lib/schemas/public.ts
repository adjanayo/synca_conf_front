import { z } from "zod";

export const publicDaySchema = z.object({
  id: z.number(),
  date: z.string(),
  label: z.string(),
});

export const publicSessionSchema = z.object({
  id: z.number(),
  day_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  room: z.string().nullable(),
  speaker_id: z.number().nullable(),
});

export const speakerPublicSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  title_role: z.string(),
  company: z.string().nullable(),
  country: z.string(),
  linkedin_url: z.string().nullable(),
  website_url: z.string().nullable(),
  photo_url: z.string().nullable(),
  intervention_format: z.string(),
  intervention_title: z.string(),
  theme: z.string(),
  summary: z.string(),
  audience_level: z.string().nullable(),
  language: z.string().nullable(),
});

export const partnerPublicSchema = z.object({
  id: z.number(),
  organization_name: z.string(),
  website_url: z.string().nullable(),
  logo_url: z.string().nullable(),
  level_id: z.number(),
});

export const exhibitorPublicSchema = z.object({
  id: z.number(),
  organization_name: z.string(),
  website_url: z.string().nullable(),
  stand_type: z.string(),
});

export const faqCategoryPublicSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const faqPublicSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  question: z.string(),
  answer: z.string(),
  sort_order: z.number(),
});

export const passContentSchema = z.object({
  id: z.number(),
  label: z.string(),
});

export const passTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string().nullable(),
  max_days: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  contents: z.array(passContentSchema),
});

export const campaignWindowSchema = z.object({
  id: z.number(),
  key: z.string(),
  start_at: z.string(),
  end_at: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const hackathonTeamMemberSchema = z.object({
  id: z.number(),
  team_id: z.number(),
  full_name: z.string(),
  study_level: z.string(),
  specialty: z.string(),
  photo_url: z.string().nullable(),
});

export const hackathonTeamSchema = z.object({
  id: z.number(),
  university_name: z.string(),
  name: z.string(),
  project_name: z.string(),
  project_description: z.string(),
  members: z.array(hackathonTeamMemberSchema),
});
