import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommentPayload } from './comment.payload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  //Obtener todos los comentarios que tengan postid=1 json server
  getAllCommentsForPost(id: number) {
    return this.httpClient.get<CommentPayload[]>('http://localhost:3000/comments?postId=' + id);
  }

  //Postear comentarios json server

  postComment(commentPayload: CommentPayload): Observable<any> {
    console.log(commentPayload);
    return this.httpClient.post('http://localhost:3000/comments/', commentPayload);
  }

  getAllCommentsByUser(name: string) {
    console.log(name);
    return this.httpClient.get<CommentPayload[]>('http://localhost:3000/comments?userName=' + name);
  }
}
