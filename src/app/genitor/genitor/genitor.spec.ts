import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genitor } from './genitor';

describe('Genitor', () => {
  let component: Genitor;
  let fixture: ComponentFixture<Genitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Genitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
