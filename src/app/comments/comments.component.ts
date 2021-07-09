import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommentSchema, CommentsSchema } from 'src/dataConfig/comments.schema';
import { PostsSchema } from 'src/dataConfig/posts.schema';
import { UsersSchema } from 'src/dataConfig/users.schema';
import { CommentsService } from '../comments.service';
import { PostsService } from '../posts.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  message = new FormControl('');
  userId = new FormControl(0);
  postId = new FormControl(0);
  users: UsersSchema = [];
  posts: PostsSchema = [];
  comments: CommentsSchema = [];
  updateState: boolean = false;
  idCommentBeUpdated: number = -1;
  newMessage = new FormControl('');

  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.fetchComments();
    this.fetchUsers();
    this.fetchPosts();
  }
  fetchUsers() {
    this.usersService.get().subscribe((users: UsersSchema) => {
      this.users = users;
    });
  }
  fetchPosts() {
    this.postsService.get().subscribe((posts: PostsSchema) => {
      this.posts = posts;
    });
  }
  fetchComments() {
    this.commentsService.get().subscribe((comments: CommentsSchema) => {
      this.comments = comments;
    });
  }
  getName(id: number): string {
    const user = this.users.find((u) => u.id === id);
    if (user) return user?.name;
    return '';
  }
  onSubmit() {
    if (this.message.invalid || this.userId.invalid || this.postId.invalid) {
      return;
    }
    const comment: CommentSchema = {
      message: this.message.value,
      userId: parseInt(this.userId.value),
      postId: parseInt(this.postId.value),
    };
    this.commentsService.post(comment).subscribe((commnet) => {
      this.comments.push(comment);
      this.message.reset();
      this.userId.reset();
      this.postId.reset();
    });
  }
  deleteComment(id: number) {
    this.commentsService.delete(id).subscribe();
    const idx = this.comments.findIndex((cmt) => cmt.id === id);
    this.comments.splice(idx, 1);
  }
  onUpdateState(comment: CommentSchema) {
    if (comment.id) this.idCommentBeUpdated = comment.id;
    this.updateState = true;
    this.newMessage.setValue(comment.message);
  }
  updateComment(comment: CommentSchema) {
    if(this.newMessage.invalid) return;
    comment.message = this.newMessage.value;
    this.updateState = false;
    this.idCommentBeUpdated = -1;
    this.commentsService.put(comment).subscribe();
    const idx = this.comments.findIndex((cmt) => cmt.id === comment.id);
    this.comments[idx].message = comment.message;
  }
  cancel() {
    this.updateState = false;
    this.idCommentBeUpdated = -1;
  }
}
