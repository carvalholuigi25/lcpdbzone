import { ChatService } from '@/app/services/data/chat.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
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
export class Admsupport implements OnInit, OnDestroy {
  @Input() hideSidebar: boolean = false;

  isSuportEnabled: boolean = false;

  id: number = 1;
  messages: Message[] = [];
  userInput = '';
  loading = false;
  private abortController: AbortController | null = null;

  constructor(
    private chatService: ChatService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
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
    // resend last user message if present
    const lastUser = [...this.messages].reverse().find(m => m.role === 'user');
    if (lastUser?.content) {
      this.userInput = lastUser.content;
      await this.sendMessageStream();
    }
  }
  async sendMessageStream() {
    if (!this.userInput.trim() || this.loading) return;

    const userId = this.id++;
    const userMessage: Message = {
      id: userId,
      role: 'user',
      content: this.userInput,
    };

    const assistantMessage: Message = {
      id: userId,
      role: 'assistant',
      content: '',
    };

    this.messages.push(userMessage, assistantMessage);
    this.userInput = '';
    this.loading = true;

    const conversation = [...this.messages];

    // abort any previous
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      await this.chatService.sendMessage(
        conversation,
        (chunk) => {
          // ensure UI updates run inside Angular zone
          this.ngZone.run(() => {
            assistantMessage.content += chunk;
            this.cdr.markForCheck();
          });
        },
        this.abortController.signal
      );
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error(err);
        this.ngZone.run(() => {
          assistantMessage.content += '\n\n[Error receiving response]';
          this.cdr.markForCheck();
        });
      }
    } finally {
      this.loading = false;
      this.abortController = null;
    }
  }
}
