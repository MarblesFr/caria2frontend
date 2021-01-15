import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiOutputComponent } from './ai-output.component';

describe('AiOutputComponent', () => {
  let component: AiOutputComponent;
  let fixture: ComponentFixture<AiOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
