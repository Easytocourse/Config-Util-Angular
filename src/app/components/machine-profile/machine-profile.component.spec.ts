import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineProfileComponent } from './machine-profile.component';

describe('MachineProfileComponent', () => {
  let component: MachineProfileComponent;
  let fixture: ComponentFixture<MachineProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
