export interface ScriptFormData {
  title: string;
  goal: string;
  audience: string;
  tone: string;
  duration: string;
  section_durations: {
    intro: string;
    dev: string;
    conclusion: string;
  };
}

export interface ScriptResponse {
  success: boolean;
  data: {
    id: number;
    user_id: number;
    title: string;
    goal: string;
    audience: string;
    tone: string;
    duration: string;
    section_durations: {
      intro: string;
      dev: string;
      conclusion: string;
    };
    intro_text: string;
    dev_text: string;
    conclusion_text: string;
    full_script: string;
    created_at: string;
    updated_at: string;
  };
  message: string;
}
export interface ScriptData {
  id: number;
  user_id: number;
  title: string;
  goal: string;
  audience: string;
  tone: string;
  duration: string;
  section_durations: {
    intro: string;
    dev: string;
    conclusion: string;
  };
  intro_text: string;
  dev_text: string;
  conclusion_text: string;
  full_script: string;
  created_at: string;
  updated_at: string;
}

export interface ScriptsListResponse {
  success: boolean;
  data: {
    current_page: number;
    data: ScriptData[]; 
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string;
}