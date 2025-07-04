import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEmployees } from './table-employees';

describe('TableEmployees', () => {
  let component: TableEmployees;
  let fixture: ComponentFixture<TableEmployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableEmployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableEmployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
