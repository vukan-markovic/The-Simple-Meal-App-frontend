import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Type } from 'src/app/models/type';
import { TypeService } from 'src/app/services/type.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-types',
  templateUrl: './table-types.component.html',
  styleUrls: ['./table-types.component.css']
})
export class TableTypesComponent implements OnInit {
  types: Array<Type> = [];
  public searchString: string;
  private successSub: Subscription;
  show: boolean = false;
  currentType: Type;
  displayedColumns: string[] = ['name', 'price', 'update'];
  dataSource: MatTableDataSource<Type>;
  //this input I use to clear filter input field 
  filterInput: HTMLInputElement;

  @ViewChild(MatSort, { static: true }) typeSort: MatSort;

  constructor(private typeService: TypeService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private toastr: ToastrService) {
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/search.svg'));
  }

  ngOnInit() {
    this.successSub = this.typeService.successEmitter.subscribe(data => {
      this.getTypes();
      this.toastr.success("Successfully update a type.", 'Update type');
    });

    this.getTypes();

    this.successSub = this.typeService.addTypeSuccessEmitter.subscribe(data => {
      this.getTypes();
      this.toastr.success("Successfully added a new type.", 'Add type');
    });
  }

  giveFocus() {
    var filter = document.getElementById("filter");
    filter.focus();
  }

  getTypes() {
    this.filterInput = document.getElementById("filterInput") as HTMLInputElement;
    this.filterInput.value = "";
    this.typeService.getAllType().subscribe(data => {
      if (data != null && data.length != 0) {
        this.types = data;
        this.dataSource = new MatTableDataSource(this.types);
        this.dataSource.sort = this.typeSort;
      } else {
        this.types = [];
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  update(type: Type) {
    if (type != null) {
      this.show = true;
      this.currentType = type;
    }
  }
}