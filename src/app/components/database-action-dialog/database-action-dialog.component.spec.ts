import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseActionDialogComponent } from './database-action-dialog.component';

describe('DatabaseActionDialogComponent', () => {
  let component: DatabaseActionDialogComponent;
  let fixture: ComponentFixture<DatabaseActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatabaseActionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatabaseActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
