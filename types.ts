export enum ExecutorType {
  AI = 'AI',
  HUMAN = 'HUMAN',
  TOOL = 'TOOL'
}

export interface Task {
  id: string;
  task_name: string;
  executor_type: ExecutorType;
  actionable_content: string; // The prompt for AI, or JD for Human, or Tool recommendation
  status: 'pending' | 'completed';
  result?: string; // Text result or Image URL
  resultType?: 'text' | 'image';
}

export interface ProjectPlan {
  originalIdea: string;
  tasks: Task[];
}

export interface ImageGenerationConfig {
  aspectRatio: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
  imageSize: '1K' | '2K' | '4K';
}

export const ASPECT_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'] as const;
export const IMAGE_SIZES = ['1K', '2K', '4K'] as const;