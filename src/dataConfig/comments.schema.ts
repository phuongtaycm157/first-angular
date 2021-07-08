interface CommentSchema {
  id?: number;
  message: string;
  userId: number;
  postId: number;
}
type CommentsSchema = Array<CommentSchema>;
export { CommentSchema, CommentsSchema };
