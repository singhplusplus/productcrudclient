import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deletemodal',
  templateUrl: './deletemodal.component.html',
  styleUrls: ['./deletemodal.component.scss']
})
export class DeletemodalComponent implements OnInit {

  @Input() productName = "";
  deleteConfirmText = "";
  confirmError = "";
  
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  closeWithoutDelete() {
    this.activeModal.dismiss('Close');
  }

  closeConfirmDelete() {
    if(this.deleteConfirmText === this.productName) {
      this.activeModal.close('Confirm');
    }
    else {
      this.confirmError = "Wrong";
    }
  }
}
