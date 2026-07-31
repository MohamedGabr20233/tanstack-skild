// type definitions

export interface SkillRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  install_command: string;
  prompt_config: string;
  usage_example: string;
  created_at: string | null;
  author_id: string;
  author_email: string | null;
  author_image: string | null;
  installs_count: number;
  votes_count: number;
  /** whether the current viewer has upvoted — false for signed-out visitors */
  hasVoted?: boolean;
}

export interface profileSchema {
  id: string,
  avatar_url: string
  full_name: string
  email: string
}