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
  private abortController: AbortController | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    if (this.loading && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      this.loading = false;
    }
  }

  toggleSupport() {
    this.isSuportEnabled = !this.isSuportEnabled;
  }

  clearMessage() {
    if (this.loading && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.messages = [];
    this.userInput = "";
    this.loading = false;
  }

  async refreshMessageStream() {
    this.sendMessageStream();
  }

  // async sendMessage() {
  //   if (!this.userInput.trim()) return;

  //   const userMessage: Message = {
  //     id: this.id,
  //     role: 'user',
  //     content: this.userInput
  //   };

  //   this.messages.push(userMessage);
  //   const prompt = this.userInput;
  //   this.userInput = '';
  //   this.loading = true;

  //   const response = await this.chatService.sendMessage(prompt);

  //   this.messages.push({
  //     role: 'assistant',
  //     content: response
  //   });

  //   this.loading = false;
  // }

  async sendMessageStream() {
    if (!this.userInput.trim() || this.loading) return;

    const userMessage: Message = {
      id: this.id,
      role: 'user',
      content: this.userInput
    };

    const assistantMessage: Message = {
      id: this.id,
      role: 'assistant',
      content: ''
    };

    let conversation = [];

    this.messages.push(userMessage);
    this.messages.push(assistantMessage);

    this.userInput = '';
    this.loading = true;

    conversation = [...this.messages];
    
    try {
      this.abortController = null;
      this.abortController = new AbortController();

      await this.chatService.sendMessage(
        conversation,
        (chunk) => {
          assistantMessage.content += chunk;
        },
        this.abortController.signal
      ).then(() => {
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.loading = true;
      });

    } catch (err) {
      if ((err as any).name !== 'AbortError') {
        console.error(err);
      }

      this.loading = false;
    }
  }
}
