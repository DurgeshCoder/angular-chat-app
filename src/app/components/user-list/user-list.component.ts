import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  public userList: any;
  @Output() startChatEvent: EventEmitter<any> = new EventEmitter();
  constructor(private firebaseDb: AngularFireDatabase) {
    this.firebaseDb
      .list('users')
      .valueChanges()
      .subscribe((users) => {
        this.userList = users;
      });
  }
  startChat(userid: any) {
    console.log(userid);
    this.startChatEvent.emit(userid);
  }
}
