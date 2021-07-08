interface UserSchema {
    id?: number;
    name: string;
    email: string;
    password: string;
}
type UsersSchema = Array<UserSchema>;
export {UserSchema, UsersSchema}