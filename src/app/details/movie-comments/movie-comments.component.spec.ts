import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCommentsComponent } from './movie-comments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MovieCommentsComponent', () => {
  let component: MovieCommentsComponent;
  let fixture: ComponentFixture<MovieCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCommentsComponent, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieCommentsComponent as any);
    component = fixture.componentInstance;
    component.itemId = 'movie-1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
