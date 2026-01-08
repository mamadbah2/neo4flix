import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SocialComponent } from './social.component';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate avatar URL correctly', () => {
    const url = component.getAvatarUrl('testuser');
    expect(url).toContain('dicebear');
    expect(url).toContain('testuser');
  });

  it('should generate initials correctly', () => {
    expect(component.getInitials('John')).toBe('JO');
    expect(component.getInitials('AB')).toBe('AB');
  });

  it('should format dates correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    expect(component.formatDate(fiveMinutesAgo.toISOString())).toContain('min');
  });
});
