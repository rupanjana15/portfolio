import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().url(),
    imageAlt: z.string(),
    category: z.string(),
    order: z.number(),
    links: z.array(linkSchema)
  })
});

const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().url(),
    imageAlt: z.string(),
    order: z.number()
  })
});

const experience = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dates: z.string(),
    location: z.string(),
    logo: z.string(),
    logoAlt: z.string(),
    logoClass: z.string().optional(),
    order: z.number(),
    highlights: z.array(z.string())
  })
});

export const collections = {
  projects,
  events,
  experience
};
