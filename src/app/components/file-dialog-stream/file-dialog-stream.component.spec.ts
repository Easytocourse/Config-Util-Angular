import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDialogStreamComponent } from './file-dialog-stream.component';

describe('FileDialogStreamComponent', () => {
  let component: FileDialogStreamComponent;
  let fixture: ComponentFixture<FileDialogStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileDialogStreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileDialogStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
