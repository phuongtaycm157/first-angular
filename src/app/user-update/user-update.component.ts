import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserSchema } from 'src/dataConfig/users.schema';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit {
  user?: UserSchema;
  name = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchUser();
  }
  fetchUser() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.usersService.getOne(id).subscribe((user) => {
      this.user = { ...user };
      this.name.setValue(user.name);
      this.email.setValue(user.email);
      this.password.setValue(user.password);
    });
  }
  cancel(): void {
    this.location.back();
  }
  onSubmit() {
    if (this.name.invalid || this.email.invalid || this.password.invalid) {
      return;
    }
    if (this.user) {
      this.user = {
        id: this.user.id,
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
      };
      this.usersService.put(this.user).subscribe();
    }
    this.cancel();
  }
}
