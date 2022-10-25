import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from '../post-model';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { VotePayload } from './vote-payload';
import { VoteType } from './vote-type';
import { VoteService } from '../vote.service';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { PostService } from '../post.service';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() post: PostModel;
  votePayload: VotePayload;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  upvoteColor: string;
  downvoteColor: string;
  isLoggedIn: boolean;

  constructor(private voteService: VoteService,
    private authService: AuthService,
    private postService: PostService, private toastr: ToastrService) {

    this.votePayload = {
      voteType: undefined,
      postId: undefined
    }
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
  }

  ngOnInit(): void {
  }

  upvotePost() {
    this.votePayload.voteType = VoteType.UPVOTE;
    console.log("Funciona")
    this.vote();
    this.upvoteColor = 'green';
  }

  downvotePost() {
    this.votePayload.voteType = VoteType.DOWNVOTE;
    this.vote();
    this.downvoteColor = 'red';
  }

  private vote() {
    this.votePayload.postId = this.post.id;
    console.log("hola")
    this.voteService.vote(this.votePayload).subscribe(() => {
      this.updateVoteDetails();
    }, error => {
      this.toastr.error(error.error.message);
      throwError(error);
    });
  }

  private updateVoteDetails() {
    this.postService.getPost(this.post.id).subscribe(post => {
      this.post = post;
      if(this.votePayload.voteType === VoteType.UPVOTE) {
        post.voteCount+1;
        post.upVote = true;
      }
      else{
        post.voteCount=post.voteCount-1;
        post.downVote=true;
      }
    });
  }
}
