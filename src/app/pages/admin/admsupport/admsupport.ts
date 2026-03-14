import { SafeHtmlPipe } from '@/app/pipes';
import { ChatService } from '@/app/services/data/chat.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef, Inject, DOCUMENT } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as f from '@myfunctions';

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
  timeValMs = 5 * 60 * 1000;
  dateTimeWarnExpire: number = new Date().getTime() + this.timeValMs;

  private abortController: AbortController | null = null;
  private myphysicallocalstorage: Storage | null = null;
  private mytimer: any;

  constructor(
    private chatService: ChatService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    const ls = this.document.defaultView?.localStorage;

    this.myphysicallocalstorage = ls!;

    this.isSupportChatEnabled = ls?.getItem("supportChatEnabled") === "true";
    this.warningCount = ls?.getItem("warningCount") ? parseInt(ls.getItem("warningCount")!) : 0;
    this.dateTimeWarnExpire = ls?.getItem("dateTimeWarnExpire") ? parseInt(ls.getItem("dateTimeWarnExpire")!) : (new Date().getTime() + this.timeValMs);

    if(ls) {
      ls.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
      // ls.setItem("warningCount", ""+this.warningCount);
      // ls.setItem("dateTimeWarnExpire", ""+this.dateTimeWarnExpire);
    }
  }

  ngOnInit(): void {
    this.checkWarningsExpiry();
    this.removeWarningsWhenDTExpires();
    this.loadInitialChatbot();
  }

  ngOnDestroy(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.clearTimer();
  }

  toggleSupport() {
    this.isSupportChatEnabled = !this.isSupportChatEnabled;
    this.clearMessage();

    const ls = this.document.defaultView?.localStorage;
    if(ls) {
      ls.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
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
    const ls = this.document.defaultView?.localStorage;
    if(ls) {
      ls.setItem("warningCount", ""+warningCount);
      ls.removeItem("dateTimeWarnExpire");
    }
  }

  checkWarningsExpiry() {
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
  }

  removeWarningsWhenDTExpires() {
    setTimeout(() => {
      this.checkWarningsExpiry();
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

    this.clearTimer();
    this.messages = [];
    this.userInput = "";
    this.loading = false;
  }

  clearMessage() {
    if (this.loading && this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.clearTimer();
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

    this.clearTimer();
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
          this.dateTimeWarnExpire = new Date().getTime() + this.timeValMs;
          alert("Chat closed due to inappropriate language. It will be reopened at " + new Date(this.dateTimeWarnExpire).toLocaleTimeString() + ".");
        } else {
          alert("Please avoid using inappropriate language. Warning " + this.warningCount + " of " + this.maxWarnings);
        }
      }

      const ls = this.document.defaultView?.localStorage;
      if(ls) {
        ls.setItem("warningCount", ""+this.warningCount);

        if(this.warningCount >= this.maxWarnings) {
          this.dateTimeWarnExpire = new Date().getTime() + this.timeValMs;
          ls.setItem("dateTimeWarnExpire", ""+this.dateTimeWarnExpire);
        }
      }
    }
  }

  resetWarnings() {
    if(this.userInput == "$resetwarnings" || this.userInput == "!resetwarnings") {
      if(this.warningCount > 0) {
        const ls = this.document.defaultView?.localStorage;
        const loginItem = ls?.getItem("login");
        if(loginItem) {
          try {
            const login = JSON.parse(loginItem);
            if(login.role !== "admin") {
              alert("This command is for admins only!");
              return;
            }
          } catch {
            alert("Invalid login data!");
            return;
          }
        }

        if(ls) {
          ls.setItem("warningCount", "0");
        }

        setTimeout(() => {
          location.reload();
        }, 1000 / 2);
      } else {
        alert("The warnings are already reset");
      }
    }
  }

  clearTimer() {
    if(this.mytimer) {
      clearInterval(this.mytimer);
      this.mytimer = null;
    }
  }

  private handleTimeCommand(userMessage: Message, assistantMessage: Message) {
    const content = userMessage.content;
    const isTimeZoneModeEnabled = content.includes('zone:');
    let tz = 'Europe/Lisbon';
    if (isTimeZoneModeEnabled) {
      const match = content.match(/zone:\s*([^ ]+)/i);
      if (match) {
        tz = match[1];
      }
    }

    this.mytimer = setInterval(() => {
      this.ngZone.run(() => {
        assistantMessage.content = isTimeZoneModeEnabled ? `The time of timezone (${tz}) is: ${f.getTimeByTimezone(tz)}` : `The time is: ${f.getTimeNow()}`;
        this.cdr.markForCheck();
      });
    }, 1000);
  }

  private handleCountdownCommand(userMessage: Message, assistantMessage: Message) {
    const content = userMessage.content;
    let targetDate = '2026-06-04';
    const match = content.match(/to:\s*([^ ]+)/i);
    if (match) {
      targetDate = match[1];
    }

    this.mytimer = setInterval(() => {
      this.ngZone.run(() => {
        assistantMessage.content = f.getCountdownResult(targetDate);
        this.cdr.markForCheck();
      });
    }, 1000);
  }

  private handleCountupCommand(userMessage: Message, assistantMessage: Message) {
    const content = userMessage.content;
    let startDate = '2026-06-04';
    const match = content.match(/from:\s*([^ ]+)/i);
    if (match) {
      startDate = match[1];
    }

    this.mytimer = setInterval(() => {
      this.ngZone.run(() => {
        assistantMessage.content = f.getCountupResult(startDate);
        this.cdr.markForCheck();
      });
    }, 1000);
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

    // Handle special commands locally
    if (["$time", "!time"].includes(userMessage.content.split(' ')[0])) {
      this.handleTimeCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    } else if (["$countdown", "!countdown"].includes(userMessage.content.split(' ')[0])) {
      this.handleCountdownCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    } else if (["$countup", "!countup"].includes(userMessage.content.split(' ')[0])) {
      this.handleCountupCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    }

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
