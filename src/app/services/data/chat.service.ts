import { Injectable } from '@angular/core';
import process from 'process';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  //   async sendMessage(prompt: string): Promise<string> {
  //     const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer SUA_API_KEY'
  //       },
  //       body: JSON.stringify({
  //         model: 'gpt-4o-mini',
  //         messages: [
  //           { role: 'user', content: prompt }
  //         ]
  //       })
  //     });

  //     const data = await response.json();
  //     return data.choices[0].message.content;
  //   }

  // async sendMessage(prompt: string): Promise<string> {
  //   const response = await fetch('http://localhost:3000/chat', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${process.env['OPENAI_API_KEY']}`,
  //     },
  //     body: JSON.stringify({
  //       model: 'gpt-5-nano',
  //       messages: [{ role: 'assistant', content: prompt }],
  //     }),
  //   });

  //   const data = await response.json();
  //   return data.content ?? data.choices[0].message.content;
  // }

  async sendMessage(
    messages: any[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> {

    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env['OPENAI_API_KEY']}`,
      },
      body: JSON.stringify({ 
         model: 'gpt-5-nano',
         messages: messages,
      }),
      signal
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  }
}
