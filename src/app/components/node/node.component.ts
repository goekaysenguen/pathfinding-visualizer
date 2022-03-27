import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  @Input() isStart!: boolean
  @Input() isEnd!: boolean
  @Input() isVisited: boolean = false;
  @Input() isPath: boolean = false;
  @Input() isWall!: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}
