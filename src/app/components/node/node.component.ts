import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  static nodeSize: number = 24;

  @Input() isStart!: boolean
  @Input() isEnd!: boolean
  @Input() isVisited: boolean = false;
  @Input() isPath: boolean = false;
  @Input() isWall!: boolean;
  @Input() animate!: boolean;

  constructor() { }

  ngOnInit(): void {
    console.log(this.animate);
  }
}
