import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataDialogComponent } from '../data-dialog/data-dialog.component';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-line-display-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './line-display-dialog.component.html',
  styleUrl: './line-display-dialog.component.css'
})
export class LineDisplayDialogComponent {
  confForm: FormGroup = this.formBuilder.group({
    operatores: [this.storageService.getItem('operatores'), Validators.required],
    rangeTime: [this.storageService.getItem('rangeTime'), Validators.required],
    target:[this.storageService.getItem('target'), Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LineDisplayDialogComponent>
  ) {}

  updateData() {
    if (this.confForm.valid) {
      let rangeTimeValue = this.confForm.get('rangeTime')?.value;
      let operatorsValue = this.confForm.get('operatores')?.value;
      let target = this.confForm.get('target')?.value;
      this.storageService.setItem('rangeTime', rangeTimeValue);
      this.storageService.setItem('operatores', operatorsValue);
      this.storageService.setItem('target', target);
      this.dialogRef.close();
      window.location.reload();
    } else {
      this.snackBar.open("Please enter correct data", "OK", { duration: 3000 });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
