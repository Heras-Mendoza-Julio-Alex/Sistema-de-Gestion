import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ticketform } from './ticketform';

describe('Ticketform', () => {
  let component: Ticketform;
  let fixture: ComponentFixture<Ticketform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ticketform],
    }).compileComponents();

    fixture = TestBed.createComponent(Ticketform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
