import { Component, OnInit } from '@angular/core';

import { UserSchema, UsersSchema } from 'src/dataConfig/users.schema';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: UsersSchema | undefined;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    // this.showUsers();
  }

  showUsers() {
    this.userService.get().subscribe((users: UsersSchema) => {
      this.users = users;
      console.log(this.users);
    });
  }

  addUser(newUser: UserSchema) {
    this.userService
      .post(newUser)
      .subscribe((user) => this.users?.push(user));
  }

  deleteUser(userId: number) {
    this.userService.delete(userId).subscribe();
    const idx = this.users?.findIndex((user) => user.id === userId);
    if (idx) {
      this.users?.splice(idx, 1);
    }
  }

  updateUser(user: UserSchema) {
    this.userService.put(user).subscribe();
    const idx = this.users?.findIndex((u) => u.id === user.id);
    if (idx) {
      this.users?.splice(idx, 1, user);
    }
  }
}
