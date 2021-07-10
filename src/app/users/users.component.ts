import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  page: number = 1;
  lastPage: number = 1;
  nextPage: number | undefined = undefined;
  prevPage: number | undefined = undefined;
  constructor(
    private userService: UsersService,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.getPaginationPage();
  }
  getPaginationPage() {
    this.userService.get().subscribe((users) => {
      this.lastPage = Math.ceil(users.length / 10);
      this.nextPage = this.page < this.lastPage ? this.page + 1 : undefined;
      this.prevPage = this.page > 1 ? this.page - 1 : undefined;
    });
  }
  fetchUsers() {
    const page = Number(this.route.snapshot.paramMap.get('page'));
    if (!page) {
      this.page = 1;
      this.userService.paginate(1).subscribe((users: UsersSchema) => {
        this.users = users;
      });
    } else {
      this.page = page;
      this.userService.paginate(page).subscribe((users: UsersSchema) => {
        this.users = users;
      });
    }
  }
  goOtherPage(i: number) {
    this.page = i;
    this.userService.paginate(i).subscribe((users: UsersSchema) => {
      this.users = users;
    });
    this.nextPage = this.page < this.lastPage ? this.page + 1 : undefined;
    this.prevPage = this.page > 1 ? this.page - 1 : undefined;
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
    });
  }
  updateUser(user: UserSchema) {
    this.userService.put(user).subscribe();
    const idx = this.users?.findIndex((u) => u.id === user.id);
    if (idx) {
      this.users?.splice(idx, 1, user);
    }
  }
}
