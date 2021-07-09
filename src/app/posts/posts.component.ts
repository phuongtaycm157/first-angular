import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostSchema, PostsSchema } from 'src/dataConfig/posts.schema';
import { UsersSchema } from 'src/dataConfig/users.schema';
import { CommentsService } from '../comments.service';
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  posts: PostsSchema = [];
  users: UsersSchema = [];
  content = new FormControl('');
  userId = new FormControl(0);
  updateState: boolean = false;
  postUpdated?: PostSchema;
  contentUpdated = new FormControl('');
  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
    this.fetchUsers();
  }
  fetchPosts() {
    this.postsService.get().subscribe((posts: PostsSchema) => {
      this.posts = posts;
    });
  }
  fetchUsers() {
    this.usersService.get().subscribe((users) => {
      this.users = users;
    });
  }
  onSubmit() {
    if (this.content.invalid || this.userId.invalid) {
      return;
    }
    const post: PostSchema = {
      content: this.content.value,
      userId: parseInt(this.userId.value),
    };
    this.postsService.post(post).subscribe((post) => {
      this.posts.push(post);
      this.content.reset();
      this.userId.reset();
    });
  }
  deletePost(id: number) {
    this.postsService.delete(id).subscribe();
    const postIdx = this.posts.findIndex((post) => post.id === id);
    this.posts.splice(postIdx, 1);
    this.commentsService.search(undefined,id).subscribe((cmts) => {
      for (let i = 0; i < cmts.length; ++i) {
        let cmtId = cmts[i].id;
        if (!cmtId) cmtId = -1;
        this.commentsService.delete(cmtId).subscribe();
      }
    })
  }
  updateStatus(post: PostSchema) {
    this.updateState = true;
    this.postUpdated = post;
    this.contentUpdated.setValue(post.content);
  }
  cancelUpdate() {
    this.updateState = false;
  }
  updatePost() {
    if (typeof this.postUpdated?.userId === 'number') {
      this.postUpdated = {
        id: this.postUpdated?.id,
        userId: this.postUpdated?.userId,
        content: this.contentUpdated.value,
      };
    }
    this.updateState = false;
    if (this.postUpdated) {
      this.postsService.put(this.postUpdated).subscribe();
      const idx = this.posts.findIndex((post) => this.postUpdated?.id === post.id);
      this.posts[idx].content = this.postUpdated.content;
    }
  }
}
