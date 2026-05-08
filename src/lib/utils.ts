import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
src/lib/groq.ts

const GROQ_API_KEY = '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';

export interface AIResponse {
  subtasks: {
    text: string;
    how: string;
    duration: string;
  }[];
}

export async function decomposeTask(taskText: string, context: string): Promise<AIResponse> {
  const prompt = `Break down this task: "${taskText}". Context: "${context}". Output JSON with subtasks (text, how, duration).`;
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: 'You only output JSON.' }, { role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content) as AIResponse;
}
