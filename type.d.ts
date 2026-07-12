// type definitions

export interface SkillRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  installCommand: string;
  createdAt: string | null;
  authorClerkId: string | null;
  authorEmail: string | null;
}

export interface profileSchema {
  id: string,
  avatar_url: string
  full_name: string
  email: string
}