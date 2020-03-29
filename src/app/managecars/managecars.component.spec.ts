import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecarsComponent } from './managecars.component';

describe('ManagecarsComponent', () => {
  let component: ManagecarsComponent;
  let fixture: ComponentFixture<ManagecarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagecarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagecarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
