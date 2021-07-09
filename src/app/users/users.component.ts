import { Component, OnInit } from '@angular/core';

import { UserSchema, UsersSchema } from 'src/dataConfig/users.schema';
import { CommentsService } from '../comments.service';
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: UsersSchema = [];

  constructor(
    private userService: UsersService,
    private postsService: PostsService,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers() {
    this.userService.get().subscribe((users: UsersSchema) => {
      this.users = users;
    });
  }
  addUser(newUser: UserSchema) {
    this.userService.post(newUser).subscribe((user) => this.users?.push(user));
  }
  deleteUser(userId: number) {
    this.userService.delete(userId).subscribe();
    const idx = this.users?.findIndex((user) => user.id === userId);
    if (idx) {
      this.users?.splice(idx, 1);
    }
    this.postsService.search(userId).subscribe((posts) => {
      for (let i = 0; i < posts.length; ++i) {
        let postId = posts[i].id;
        if (!postId) postId = -1;
        this.postsService.delete(postId).subscribe();
      }
    });
    this.commentsService.search(userId, undefined).subscribe((cmts) => {
      for (let i = 0; i < cmts.length; ++i) {
        let cmtId = cmts[i].id;
        if (!cmtId) cmtId = -1;
        this.commentsService.delete(cmtId).subscribe();
      }
    })
  }
  updateUser(user: UserSchema) {
    this.userService.put(user).subscribe();
    const idx = this.users?.findIndex((u) => u.id === user.id);
    if (idx) {
      this.users?.splice(idx, 1, user);
    }
  }
}
