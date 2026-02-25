import { Injectable } from '@angular/core';
import process from 'process';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  async sendMessage(
    messages: any[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env?.['OPENAI_API_KEY']}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: messages,
      }),
      signal,
    });

    // If there's no streaming body, fall back to text response
    if (!response.body) {
      const text = await response.text();
      if (text) onChunk(text);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // decode streaming bytes safely
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) onChunk(chunk);
      }
    } catch (err: any) {
      // Propagate AbortError so caller can detect aborts
      if (err.name === 'AbortError') throw err;
      console.error('Error reading chat stream:', err);
      throw err;
    } finally {
      try {
        reader.releaseLock();
      } catch (e) {}
    }
  }
}
