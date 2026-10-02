import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detalleventa } from './detalleventa';

describe('Detalleventa', () => {
  let component: Detalleventa;
  let fixture: ComponentFixture<Detalleventa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalleventa],
    }).compileComponents();

    fixture = TestBed.createComponent(Detalleventa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
