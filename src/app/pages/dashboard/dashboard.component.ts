import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public user: any;
  public userDetail: any;
  chatRefObject!: string;
  message = '';

  public toUser: any;
  currentChats!: any[];
  oppChatRefObject!: string;

  currentSubscription!: Subscription;

  @ViewChild('messageBox', { static: false }) messageBox!: ElementRef;

  constructor(
    public authService: AuthService,
    private fireDb: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
    private toast: ToastrService
  ) {
    this.fireAuth.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.fireDb
        .object(`users/${user?.uid}`)
        .valueChanges()
        .subscribe((data) => {
          console.log(data);
          this.userDetail = data;
        });
    });
  }

  startChat(userid: any) {
    this.chatRefObject = `chats/${this.user.uid}***${userid}`;
    this.oppChatRefObject = `chats/${userid}***${this.user.uid}`;

    this.fireDb
      .object(`users/${userid}`)
      .valueChanges()
      .subscribe((toUser) => {
        this.toUser = toUser;
        console.log(toUser);
        if (this.currentSubscription) {
          this.currentSubscription.unsubscribe();
        }
        this.loadChat();
      });
  }
  loadChat() {
    this.currentSubscription = this.fireDb
      .list(this.chatRefObject)
      .valueChanges()
      .subscribe((chats: any[]) => {
        this.currentChats = chats;
        // console.log(chats);
        this.scrollBottom(0);
        if (this.currentChats.length <= 0) {
          console.log('chat loaded zero');
          console.log(this.oppChatRefObject);
          this.fireDb
            .list(this.oppChatRefObject)
            .valueChanges()
            .subscribe((chats1) => {
              this.currentChats = chats1;
              this.chatRefObject = this.oppChatRefObject;
              this.scrollBottom(0);
            });
        }
      });
  }

  sendMessage(message: string) {
    if (message.trim() === '') {
      return;
    }
    const messageOb = {
      message: message,
      date: new Date().toString(),
      to: this.toUser.uid,
      from: this.userDetail.uid,
    };

    this.fireDb
      .object(`${this.chatRefObject}/${new Date().toString()}`)
      .set(messageOb)
      .then((data) => {
        this.toast.success('message send success');
        this.message = '';
        this.scrollBottom(0);
      });
  }

  sendMessageForm(event: SubmitEvent) {
    event.preventDefault();
    this.sendMessage(this.message);
  }

  scrollBottom(value: number) {
    this.messageBox.nativeElement.scrollTo({
      left: 0,
      top: this.messageBox.nativeElement.scrollHeight + value,
      behavior: 'smooth',
    });
  }
}
