import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-weathernowcard',
  templateUrl: './weathernowcard.component.html',
  styleUrls: ['./weathernowcard.component.scss']
})
export class WeathernowcardComponent implements OnInit {

  @Input() weatherInfo: any;
  @Input() weatherIcon = "";
  @Input() clickable = true;
  @Output() cardClick = new EventEmitter<MouseEvent>();

  constructor() { }

  ngOnInit(): void {
  }

}
