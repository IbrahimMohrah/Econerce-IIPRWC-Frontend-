import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product-faq',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './post-product-faq.component.html',
  styleUrl: './post-product-faq.component.scss'
})
export class PostProductFaqComponent {
  productId: number;
  FAQForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute) {
    this.productId = this.activatedRoute.snapshot.params["productId"];
  }

    ngOnInit(){
      this.FAQForm = this.fb.group({
        question: [null, [Validators.required]],
        answer: [null, [Validators.required]],
      })
    }


    postFAQ(){
      this.adminService.postFAQ(this.productId, this.FAQForm.value).subscribe(res =>{
        if(res.id != null){
          this.snackBar.open('FAQ Posted Successfully!', 'Close', {
            duration: 5000
          });
          this.router.navigateByUrl('/admin/dashboard');
        }else{
          this.snackBar.open("Something went wrong", 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      })
    }

}