import { SafeHtmlPipe } from '@/app/pipes';
import { ChatService } from '@/app/services/data/chat.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, NgZone, ChangeDetectorRef, Inject, DOCUMENT } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as f from '@myfunctions';

interface Message {
  id?: string | number;
  role: string | 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
}

@Component({
  selector: 'app-admsupport',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SafeHtmlPipe],
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
  isAgeVerificationEnabled = true;
  accessChatbot = true;
  maxWarnings = 3;
  warningCount = 0;
  timeValMs = 5 * 60 * 1000;
  prefix = "$";
  prefixalt = "!";
  chatthemename: string = "mychattheme default";
  dateTimeWarnExpire: number = new Date().getTime() + this.timeValMs;

  ageverificationform = new FormGroup({
    dateBirthday: new FormControl('', [Validators.required]),
  });

  private abortController: AbortController | null = null;
  private mytimer: any;
  private ls: Storage | undefined;

  constructor(
    private chatService: ChatService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.ls = this.getActualLocalStorage();

    this.isSupportChatEnabled = this.ls?.getItem("supportChatEnabled") === "true";
    this.warningCount = this.ls?.getItem("warningCount") ? parseInt(this.ls.getItem("warningCount")!) : 0;
    this.dateTimeWarnExpire = this.ls?.getItem("dateTimeWarnExpire") ? parseInt(this.ls.getItem("dateTimeWarnExpire")!) : (new Date().getTime() + this.timeValMs);
    this.accessChatbot = this.getAccessChatbot();
    this.loadThemeChat(this.ls);

    if(this.ls) {
      this.ls.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
      // this.ls.setItem("warningCount", ""+this.warningCount);
      // this.ls.setItem("dateTimeWarnExpire", ""+this.dateTimeWarnExpire);
    }
  }

  ngOnInit(): void {
    this.checkWarningsExpiry();
    this.removeWarningsWhenDTExpires();
    this.loadChatbotStuff();
  }

  ngOnDestroy(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    this.clearTimer();
  }

  getActualLocalStorage() {
    return this.document.defaultView?.localStorage;
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  loadChatbotStuff() {
    const age = this.getAge();

    if(this.ls) {
      if(this.ls?.getItem("login") && !this.ls?.getItem("accessChatbot")) {
        this.ls.setItem("accessChatbot", "true");
      }
    }

    if(age && age >= 18) {
      this.loadInitialChatbot();      
    } else {
      this.loadAgeVerification();
    }
  }

  loadThemeChat(ls: Storage | any | undefined) {
    this.chatthemename = 'mychattheme ' + this.getThemeName(ls);    
  }

  getThemeName(ls: Storage | any | undefined) {
    return ls ? ls?.getItem("cbsettings") ? JSON.parse(ls?.getItem("cbsettings")!).appearence.theme : "default" : "default";
  }

  toggleSupport() {
    this.isSupportChatEnabled = !this.isSupportChatEnabled;
    this.clearMessage();

    if(this.ls) {
      this.ls.setItem("supportChatEnabled", ""+this.isSupportChatEnabled);
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
    if(this.ls) {
      this.ls.setItem("warningCount", ""+warningCount);
      this.ls.removeItem("dateTimeWarnExpire");
    }
  }

  checkWarningsExpiry() {
    if(this.warningCount >= this.maxWarnings) {
      const warnExpireStored = this.dateTimeWarnExpire;
  
      if(!isNaN(warnExpireStored) && new Date().getTime() >= warnExpireStored) {
        this.warningCount = 0;
        this.saveMyWarnings(this.warningCount);
        this.clearMessageWithoutInit();
        this.userInput = this.prefix+'resetwarnings';
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

  loadAgeVerification() {
    const loginval = this.ls && this.ls.getItem("login");
    if (this.isAgeVerificationEnabled) {
      if (loginval) {
        const loginData = JSON.parse(loginval);
        const dbval = loginData.dateBirthday.toString().split("T")[0] ?? loginData.dateBirthday;
        const dob = new Date(dbval);
        const age = this.calculateAge(dob);
        this.accessChatbot = age >= 18;
      } else {
        this.accessChatbot = false; // Show form if no login
      }
    } else {
      this.accessChatbot = true;
    }
  }

  getAge() {
    const {dateBirthday} = this.ageverificationform.value;
    let dob: Date | null = null;

    if (dateBirthday) {
      dob = new Date(dateBirthday);
    } else if (this.ls && this.ls.getItem("login")) {
      const loginData = JSON.parse(this.ls.getItem("login")!);
      const dbval = loginData.dateBirthday.toString().split("T")[0] ?? loginData.dateBirthday;
      dob = new Date(dbval);
    } else {
      dob = new Date(this.getActualDateBirthday());
    }

    if (dob && !isNaN(dob.getTime())) {
      return this.calculateAge(dob);
    }
    return 0;
  }

  getActualDateBirthday() {
    return this.ls && this.ls.getItem("userDateBirthday") ? ""+this.ls.getItem("userDateBirthday") : "";
  }

  onSubmitAgeVerification() {
    const {dateBirthday} = this.ageverificationform.value;
    const logindobval = this.ls && this.ls.getItem("login") ? JSON.parse(this.ls.getItem("login")!).dateBirthday : (dateBirthday || this.getActualDateBirthday());
    const dob = new Date(logindobval);

    if(this.accessChatbot) {
      this.accessChatbot = false;

      if(this.ls) {
        if(this.ls.getItem("accessChatbot")) {
          this.ls.removeItem("accessChatbot");
        }

        if(this.ls.getItem("userDateBirthday")) {
          this.ls.removeItem("userDateBirthday");
        }
      }
    }

    if (isNaN(dob.getTime())) {
      throw new Error("Invalid date!");
    }

    const age = this.calculateAge(dob);

    if(age >= 18) {
      this.isAgeVerificationEnabled = false;
      this.ls?.setItem("accessChatbot", "true");
      alert("Access granted, now you have access to this chatbot!");
    } else {
      this.isAgeVerificationEnabled = true;
      this.ls?.setItem("accessChatbot", "false");
      alert("Access denied. You must be at least 18 years old (or above)");
    }

    this.ls?.setItem("userDateBirthday", ""+dateBirthday);
    this.accessChatbot = this.getAccessChatbot();
    this.ageverificationform.reset();
    this.ageverificationform.clearValidators();
    this.loadInitialChatbot();
  }

  getAccessChatbot() {
    return this.ls && this.ls.getItem("accessChatbot") ? this.ls.getItem("accessChatbot") === "true" : false;
  }

  loadInitialChatbot() {
    if(this.messages.length === 0 && this.userInput.trim() === '') {
      this.userInput = (this.warningCount >= this.maxWarnings) ? this.prefix+'chatclosed' : this.prefix+'welcome';
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

    setTimeout(() => {
      this.messages = [];
      this.userInput = "";
      this.loadInitialChatbot();
    }, 1000 * 2);
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
          alert(`Chat closed due to inappropriate language. It will be reopened at ${new Date(this.dateTimeWarnExpire).toLocaleTimeString()}.`);
        } else {
          alert(`Please avoid using inappropriate language. Warning ${this.warningCount} of ${this.maxWarnings}`);
        }
      }

      const ls = this.getActualLocalStorage();
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
    if(this.userInput == this.prefix+"resetwarnings" || this.userInput == this.prefixalt+"resetwarnings") {
      if(this.warningCount > 0) {
        const ls = this.getActualLocalStorage();
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

  private handleThemeCommand(userMessage: Message, assistantMessage: Message) {
    const ls = localStorage;
    const content = userMessage.content;
    const match = content.match(/name:\s*(\w+)/mig);
    const options = f.listDefThemes();
    const usagecmd = "Usage: $theme name:[name] (options: " + options.toString().split(",") + ")";
    let theme = match ? match[0].split(":")[1] : "";

    this.mytimer = setTimeout(() => {
      this.ngZone.run(() => {
        if(!theme || theme.length == 0) {
          assistantMessage.content = "Please provide the theme name! \r\n" + usagecmd;
        } else {
          if(!options.includes(theme)) {
            assistantMessage.content = "This theme "+ theme +" does not exist. Please request it through the $feedback command or send email to creator of this webapp.";
          } else {
            assistantMessage.content = `${f.setTheme(ls, theme)}`;
          }
        }

        this.loadThemeChat(ls);
        this.cdr.markForCheck();
      });
    }, 500);
  }

  private handleByeCommand(assistantMessage: Message) {
    this.mytimer = setInterval(() => {
      this.ngZone.run(() => {
        assistantMessage.content = f.getMyByeMessage();
        this.endInteraction();
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
    if ([this.prefix+"time", this.prefixalt+"time"].includes(userMessage.content.split(' ')[0])) {
      this.handleTimeCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    } else if ([this.prefix+"countdown", this.prefixalt+"countdown"].includes(userMessage.content.split(' ')[0])) {
      this.handleCountdownCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    } else if ([this.prefix+"countup", this.prefixalt+"countup"].includes(userMessage.content.split(' ')[0])) {
      this.handleCountupCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    } else if ([this.prefix+"theme", this.prefixalt+"theme"].includes(userMessage.content.split(' ')[0])) {
      this.handleThemeCommand(userMessage, assistantMessage);
      this.loading = false;
      return;
    } else if ([this.prefix+"bye", this.prefixalt+"bye"].includes(userMessage.content.split(' ')[0])) {
      this.handleByeCommand(assistantMessage);
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

      if(this.userInput.trim() === this.prefix+'bye' || this.userInput.trim() === this.prefixalt+'bye') {
        this.endInteraction();
      }
    }
  }
}
