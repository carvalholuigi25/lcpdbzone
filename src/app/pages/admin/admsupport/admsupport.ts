import { SafeHtmlPipe } from '@/app/pipes';
import { ChatService } from '@/app/services/data/chat.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef, Inject, DOCUMENT } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  id?: string | number;
  role: string | 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
}

@Component({
  selector: 'app-admsupport',
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  standalone: true,
  templateUrl: './admsupport.html',
  styleUrl: './admsupport.scss',
})
export class Admsupport implements OnInit, OnDestroy {
  @Input() hideSidebar: boolean = false;

  isSupportChatEnabled: boolean = false;

  id: number = 1;
  messages: Message[] = [];
  userInput = '';
  loading = false;
  maxWarnings = 3;
  warningCount = 0;
  timeValMs = 1 * 60 * 1000;
  dateTimeWarnExpire = new Date().getTime() + this.timeValMs; // 1 minutes from now

  private abortController: AbortController | null = null;
  private mylocalStorage: Storage | null = null;

  constructor(
    private chatService: ChatService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.mylocalStorage = localStorage || null;

    this.isSupportChatEnabled = localStorage?.getItem("supportChatEnabled") === "true";
    this.warningCount = localStorage?.getItem("warningCount") ? parseInt(localStorage.getItem("warningCount")!) : 0;

    if(localStorage) {
      localStorage.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
    }
  }

  ngOnInit(): void {
    this.removeWarningsWhenDTExpires();
    this.loadInitialChatbot();
  }

  ngOnDestroy(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  toggleSupport() {
    this.isSupportChatEnabled = !this.isSupportChatEnabled;
    this.clearMessage();

    if(this.document.defaultView?.localStorage) {
      this.document.defaultView?.localStorage.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
    }
  }

  removeWarningsWhenDTExpires() {
    setTimeout(() => {
      if(this.warningCount >= this.maxWarnings) {
        const warnExpireStored = localStorage?.getItem("dateTimeWarnExpire") ? parseInt(localStorage.getItem("dateTimeWarnExpire")!) : 0;
    
        if(new Date().getTime() >= warnExpireStored) {
          if(localStorage?.getItem("warningCount")) {
            localStorage.removeItem("warningCount");
            localStorage.setItem("warningCount", "0");
          }

          if(localStorage?.getItem("dateTimeWarnExpire")) {
            localStorage.removeItem("dateTimeWarnExpire");
            localStorage.setItem("dateTimeWarnExpire", "");
          }
        }
      }
    }, 1000 * 60 * 1);
  }

  loadInitialChatbot() {
    if(this.messages.length === 0 && this.userInput.trim() === '') {
      if(this.warningCount >= this.maxWarnings) {
        this.userInput = '$chatclosed';
      } else {
        this.userInput = '$welcome';
      }

      this.sendMessageStream();
    }
  }

  clearMessage() {
    if (this.loading && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.messages = [];
    this.userInput = "";
    this.loading = false;
    this.loadInitialChatbot();
  }

  endInteraction() {
    if (this.loading && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
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

  async checkMessageProfanity() {
    const profanityList = (await import('profanityfilters.json')).profanityFilters || [];
    if(profanityList && profanityList.some(word => this.userInput.includes(word))) {
      // this.userInput = '';
      this.userInput = this.userInput.replace(new RegExp(profanityList.join('|'), 'gi'), '****');

      if(this.warningCount <= this.maxWarnings) {
        this.warningCount++;
      }

      if(new Date().getTime() >= this.dateTimeWarnExpire) {
        this.warningCount = 0;
        this.dateTimeWarnExpire = new Date().getTime() + this.timeValMs; // reset timer
        alert("Warnings reset. Please avoid using inappropriate language.");
      } else {
        if(this.warningCount >= this.maxWarnings) {
          alert("Chat closed due to inappropriate language. It will be reopened at " + new Date(this.dateTimeWarnExpire).toLocaleTimeString() + ".");
        } else {
          alert("Please avoid using inappropriate language. Warning " + this.warningCount + " of " + this.maxWarnings);
        }
      }

      if(this.mylocalStorage) {
        this.mylocalStorage.setItem("warningCount", ""+this.warningCount);

        if(this.warningCount >= this.maxWarnings) {
          this.mylocalStorage.setItem("dateTimeWarnExpire", ""+this.dateTimeWarnExpire);
        }
      }
    }
  }

  async sendMessageStream() {
    if (!this.userInput.trim() || this.loading) return;

    await this.checkMessageProfanity();

    const userId = this.id++;
    
    const userMessage: Message = {
      id: userId,
      role: 'user',
      content: this.userInput,
      timestamp: new Date().toISOString()
    };

    const assistantMessage: Message = {
      id: userId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
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

      if(this.userInput.trim() === '$bye' || this.userInput.trim() === '!bye') {
        this.endInteraction();
      }
    }
  }
}
