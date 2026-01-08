import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../../core/services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts from service', () => {
    toastService.success('Test message');
    fixture.detectChanges();
    
    const toastElements = fixture.nativeElement.querySelectorAll('.toast-item');
    expect(toastElements.length).toBe(1);
  });

  it('should return correct icon for each type', () => {
    expect(component.getToastIcon('success')).toContain('circle-check');
    expect(component.getToastIcon('error')).toContain('circle-exclamation');
    expect(component.getToastIcon('info')).toContain('circle-info');
    expect(component.getToastIcon('warning')).toContain('triangle-exclamation');
  });

  it('should return correct classes for each type', () => {
    expect(component.getToastClasses('success')).toContain('toast-success');
    expect(component.getToastClasses('error')).toContain('toast-error');
  });
});
