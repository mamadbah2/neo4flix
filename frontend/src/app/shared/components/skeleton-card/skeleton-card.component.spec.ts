import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonCardComponent } from './skeleton-card.component';

describe('SkeletonCardComponent', () => {
  let component: SkeletonCardComponent;
  let fixture: ComponentFixture<SkeletonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default dimensions', () => {
    expect(component.width).toBe('267px');
    expect(component.height).toBe('401px');
  });

  it('should render skeleton element with animation', () => {
    const skeletonElement = fixture.nativeElement.querySelector('.skeleton-card');
    expect(skeletonElement).toBeTruthy();
    expect(skeletonElement.classList.contains('animate-pulse')).toBeTruthy();
  });
});
