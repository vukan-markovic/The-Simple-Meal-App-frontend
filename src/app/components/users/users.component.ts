import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { UsersService } from '../../services/users.service';
import { UserDTO } from 'src/app/models/userDTO';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  isDataAvailable:boolean = false;

  displayedColumns: string[] = ['name', 'lastName', 'email', 'status', 'role'];
  dataSource: MatTableDataSource<UserDTO>;
  public users: UserDTO[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private usersService: UsersService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/search.svg'));
  }

  ngOnInit() {
    this.init();
  }
  init(){
    this.usersService.getUsers().subscribe((data) => {
      if (data != null && data.length != 0)
        this.users = data;
        if(this.users!=null){
          var userEmail = JSON.parse(localStorage.getItem("currentUser")).email;
          this.users = this.users.filter(user => user.email != userEmail );
        }
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.isDataAvailable = true;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  updateStatus(user: UserDTO): void {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userId == user.userId) {
        if (this.users[i].status == 4) {
          this.usersService.updateUser(this.users[i].userId, "ACTIVE");
            this.users[i].status = 2;
          
        } else {
          this.usersService.updateUser(this.users[i].userId, "BAN");
            this.users[i].status = 4;
          
        }

      }
    }
  }

  updateRole(user: UserDTO): void {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].userId == user.userId) {
        if (this.users[i].role === 'ADMIN') {
          this.usersService.updateUser(this.users[i].userId, "DEMOTION")
            this.users[i].role = 'USER';
          
        } else {
          this.usersService.updateUser(this.users[i].userId, "PROMOTE");
            this.users[i].role = 'ADMIN';
          
        }
      }
    }
  }
}
