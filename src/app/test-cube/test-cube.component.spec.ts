import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCubeComponent } from './test-cube.component';

describe('TestCubeComponent', () => {
  let component: TestCubeComponent;
  let fixture: ComponentFixture<TestCubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCubeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
