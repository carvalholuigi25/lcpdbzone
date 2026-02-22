import { ChatService } from '@/app/services/data/chat.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  id?: string | number;
  role: string | 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-admsupport',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './admsupport.html',
  styleUrl: './admsupport.scss',
})
export class Admsupport implements OnInit {
  @Input() hideSidebar: boolean = false;

  isSuportEnabled: boolean = false;

  id: number = 1;
  messages: Message[] = [];
  userInput = '';
  loading = false;
  private abortController?: AbortController;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    
  }

  toggleSupport() {
    this.isSuportEnabled = !this.isSuportEnabled;
  }

  clearMessage() {
    if (this.loading && this.abortController) {
      this.abortController.abort();
    }

    this.messages = [];
    this.loading = false;
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage: Message = {
      id: this.id,
      role: 'user',
      content: this.userInput
    };

    this.messages.push(userMessage);
    const prompt = this.userInput;
    this.userInput = '';
    this.loading = true;

    const response = await this.chatService.sendMessage(prompt);

    this.messages.push({
      role: 'assistant',
      content: response
    });

    this.loading = false;
  }

  async sendMessageStream() {
    if (!this.userInput.trim() || this.loading) return;

    const userMessage: Message = {
      role: 'user',
      content: this.userInput
    };

    this.messages.push(userMessage);

    const assistantMessage: Message = {
      role: 'assistant',
      content: ''
    };

    this.messages.push(assistantMessage);

    const conversation = [...this.messages];

    this.userInput = '';
    this.loading = true;

    this.abortController = new AbortController();

    try {
      await this.chatService.streamMessage(
        conversation,
        (chunk) => {
          assistantMessage.content += chunk;
        },
        this.abortController.signal
      );
    } catch (err) {
      if ((err as any).name !== 'AbortError') {
        console.error(err);
      }
    }

    this.loading = false;
  }
}
