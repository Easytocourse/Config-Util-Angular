import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledJobsDialogComponent } from './scheduled-jobs-dialog.component';

describe('ScheduledJobsDialogComponent', () => {
  let component: ScheduledJobsDialogComponent;
  let fixture: ComponentFixture<ScheduledJobsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduledJobsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduledJobsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
