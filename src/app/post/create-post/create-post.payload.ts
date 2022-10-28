import { CommentPayload } from 'src/app/comment/comment.payload';
import { UserProfileComponent } from './../../auth/user-profile/user-profile.component';
export class CreatePostPayload {
    postName: string;
    subredditName?: string;
    url?: string;
    description: string;
    userName?: string;
    voteCount?: number;
    commentCount?: number;
    duration?: string;
}