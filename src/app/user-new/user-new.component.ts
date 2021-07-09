import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserSchema } from 'src/dataConfig/users.schema';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css'],
})
export class UserNewComponent implements OnInit {
  constructor(private location: Location, private usersService: UsersService) {}

  ngOnInit(): void {}

  cancel(): void {
    this.location.back();
  }

  onSubmit(formNewUser: NgForm): void {
    if (formNewUser.invalid) {
      return;
    }
    const newUser: UserSchema = { ...formNewUser.value };
    this.usersService.post(newUser).subscribe();
    this.cancel();
  }
}
