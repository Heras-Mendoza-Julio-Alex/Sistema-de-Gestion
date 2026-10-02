import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirProducto } from './anadir-producto';

describe('AnadirProducto', () => {
  let component: AnadirProducto;
  let fixture: ComponentFixture<AnadirProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(AnadirProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
