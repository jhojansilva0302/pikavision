import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { environment } from '../../../environments/environment';

describe('CommentService', () => {
  let svc: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [CommentService] });
    svc = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch comments by item', () => {
    const itemId = 'movie-42';
    const mock = [{ id: '1', appId: 'MovieNexus', itemId, author: 'A', text: 'Hi', rating: 5, createdAt: new Date().toISOString() }];

    svc.getCommentsByItem(itemId).subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].itemId).toBe(itemId);
    });

    const req = httpMock.expectOne(req => req.urlWithParams.includes('itemId=movie-42'));
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
