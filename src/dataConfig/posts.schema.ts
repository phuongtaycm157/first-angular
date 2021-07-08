interface PostSchema {
  id?: number;
  content: string;
  userId: number;
}
type PostsSchema = Array<PostSchema>;
export { PostSchema, PostsSchema };
