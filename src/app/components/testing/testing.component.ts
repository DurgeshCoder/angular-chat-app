import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  constructor() { }
  myForm: FormGroup | any;
  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl(''),
   
    });
  }
  onSubmit() {
   
    console.log(this.myForm?.value);
    this.myForm.reset();

  }
}
