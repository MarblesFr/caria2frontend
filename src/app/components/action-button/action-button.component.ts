import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Action, ActionService} from '../../services/action-service/action.service';

@Component({
  selector: 'caria-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit {

  dropdownItems$: Observable<Action[]>;

  constructor(private actionService: ActionService) {
  }

  ngOnInit(): void {
    this.dropdownItems$ = this.actionService.actions$;
  }

  clickItem(item: Action) {
    this.actionService.executeAction(item);
  }
}
