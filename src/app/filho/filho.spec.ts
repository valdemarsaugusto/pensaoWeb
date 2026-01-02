import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filho } from './filho';

describe('Filho', () => {
  let component: Filho;
  let fixture: ComponentFixture<Filho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filho]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Filho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
