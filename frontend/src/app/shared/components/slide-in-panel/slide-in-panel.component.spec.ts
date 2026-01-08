import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideInPanelComponent } from './slide-in-panel.component';
import { vi } from 'vitest';

describe('SlideInPanelComponent', () => {
  let component: SlideInPanelComponent;
  let fixture: ComponentFixture<SlideInPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideInPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideInPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render content when closed', () => {
    component.open = false;
    fixture.detectChanges();
    
    const panel = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(panel).toBeNull();
  });

  it('should render content when open', () => {
    component.open = true;
    fixture.detectChanges();
    
    const panel = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(panel).toBeTruthy();
  });

  it('should emit closed event when close is called', () => {
    component.open = true;
    fixture.detectChanges();
    
    const closedSpy = vi.spyOn(component.closed, 'emit');
    component.close();
    
    expect(closedSpy).toHaveBeenCalled();
  });

  it('should close on Escape key', () => {
    component.open = true;
    fixture.detectChanges();
    
    const closeSpy = vi.spyOn(component, 'close');
    component.onEscapeKey();
    
    expect(closeSpy).toHaveBeenCalled();
  });
});
