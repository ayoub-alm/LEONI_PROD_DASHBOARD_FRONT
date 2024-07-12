import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../services/storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-data-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './data-dialog.component.html',
  styleUrls: ['./data-dialog.component.css']
})
export class DataDialogComponent {

  confForm: FormGroup = this.formBuilder.group({
    operatores: [this.storageService.getItem('operatores'), Validators.required],
    rangeTime: [this.storageService.getItem('rangeTime'), Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DataDialogComponent>
  ) {}

  updateData() {
    if (this.confForm.valid) {
      let rangeTimeValue = this.confForm.get('rangeTime')?.value;
      let operatorsValue = this.confForm.get('operatores')?.value;
      this.storageService.setItem('rangeTime', rangeTimeValue);
      this.storageService.setItem('operatores', operatorsValue);
      this.dialogRef.close();
    } else {
      this.snackBar.open("Please enter correct data", "OK", { duration: 3000 });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
