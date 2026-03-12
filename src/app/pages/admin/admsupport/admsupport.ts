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
  dateTimeWarnExpire: any = new Date().getTime() + this.timeValMs; // 1 minutes from now

  private abortController: AbortController | null = null;
  private myphysicallocalstorage: Storage | null = null;

  constructor(
    private chatService: ChatService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    this.myphysicallocalstorage = localStorage || null;

    this.isSupportChatEnabled = localStorage?.getItem("supportChatEnabled") === "true";
    this.warningCount = localStorage?.getItem("warningCount") ? parseInt(localStorage.getItem("warningCount")!) : (parseInt(this.myphysicallocalstorage?.getItem("warningCount")! ?? 0));
    this.dateTimeWarnExpire = localStorage?.getItem("dateTimeWarnExpire") ? parseInt(localStorage.getItem("dateTimeWarnExpire")!) : (parseInt(this.myphysicallocalstorage?.getItem("dateTimeWarnExpire")! ?? (new Date().getTime() + this.timeValMs)));

    if(localStorage) {
      localStorage.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
      // localStorage.setItem("warningCount", ""+this.warningCount);
      // localStorage.setItem("dateTimeWarnExpire", ""+this.dateTimeWarnExpire);
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

  getClosedChatMsg(warnExpireTime: any) {
    return `
    <div class="fmessage chatclosed animate__animated animate__fadeIn">
      <i class="bi bi-lock-fill chatclosedicon"></i>
      <h2 class="chatclosedtitle">Chat is closed</h2>
      <span class="chatclosedmsg">The chat is currently closed due to reached of max warnings (Reason: <b>inappropriate language behaviour</b>)! The chat will reactivate after ${new Date(warnExpireTime).toLocaleString()}!</span>
      <div class="d-block mt-3">
        <button class="btn btn-primary btnclose" onclick="location.reload()">Refresh</button>
      </div>
    </div>`;
  }

  saveMyWarnings(warningCount: number = 0) {
    if(this.myphysicallocalstorage?.getItem("warningCount")) {
      this.myphysicallocalstorage?.removeItem("warningCount");
      this.myphysicallocalstorage?.setItem("warningCount", ""+warningCount);
    }

    if(this.myphysicallocalstorage?.getItem("dateTimeWarnExpire")) {
      this.myphysicallocalstorage?.removeItem("dateTimeWarnExpire");
    }

    if(localStorage?.getItem("warningCount")) {
      localStorage.removeItem("warningCount");
      localStorage.setItem("warningCount", ""+warningCount);
    }

    if(localStorage?.getItem("dateTimeWarnExpire")) {
      localStorage.removeItem("dateTimeWarnExpire");
    }
  }

  removeWarningsWhenDTExpires() {
    setTimeout(() => {
      if(this.warningCount >= this.maxWarnings) {
        const warnExpireStored = this.dateTimeWarnExpire;
    
        if(!isNaN(warnExpireStored) && new Date().getTime() >= warnExpireStored) {
          this.warningCount = 0;
          this.saveMyWarnings(this.warningCount);
          this.clearMessageWithoutInit();
          this.userInput = '$resetwarnings';
          this.sendMessageStream();
          
          setTimeout(() => {
            location.reload();
          }, 100 * 5);
        }
      }
    }, this.timeValMs);
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

  clearMessageWithoutInit() {
    if (this.loading && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.messages = [];
    this.userInput = "";
    this.loading = false;
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
    const profanityList = (await import('profanityfilters.json')).badwords || [];
    if(profanityList && profanityList.some(word => this.userInput.toLowerCase().includes(word.toLowerCase()))) {
      // this.userInput = '';
      this.userInput = this.userInput.replace(new RegExp(profanityList.join('|'), 'gi'), '****');

      if(this.warningCount < this.maxWarnings) {
        this.warningCount++;
      } else {
        this.warningCount = 0;
      }

      if(this.dateTimeWarnExpire && new Date().getTime() >= this.dateTimeWarnExpire) {
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

      if(localStorage) {
        localStorage.setItem("warningCount", ""+this.warningCount);

        if(this.warningCount >= this.maxWarnings) {
          localStorage.setItem("dateTimeWarnExpire", ""+(new Date().getTime() + this.timeValMs));
        }
      }

      if(this.myphysicallocalstorage) {
        this.myphysicallocalstorage.setItem("warningCount", ""+this.warningCount);

        if(this.warningCount >= this.maxWarnings) {
          this.myphysicallocalstorage.setItem("dateTimeWarnExpire", ""+(new Date().getTime() + this.timeValMs));
        }
      }
    }
  }

  resetWarnings() {
    if(this.userInput == "$resetwarnings" || this.userInput == "!resetwarnings") {
      if(this.warningCount > 0) {
        if(localStorage) {
          if(localStorage.getItem("login") && JSON.parse(localStorage.getItem("login")!).role !== "admin") {
            alert("This command is for admins only!");
            return;
          }

          localStorage.setItem("warningCount", "0");
        }

        if(this.myphysicallocalstorage) {
          this.myphysicallocalstorage!.setItem("warningCount", "0");
        }

        setTimeout(() => {
          location.reload();
        }, 1000 / 2);
      } else {
        alert("The warnings already reseted")!;
      }
    }
  }

  async sendMessageStream() {
    if (!this.userInput.trim() || this.loading) return;

    await this.checkMessageProfanity();
    this.resetWarnings();

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
