import { Component, OnInit } from '@angular/core';
import { AlgorithmService, Algorithm } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';
import { Subject } from 'rxjs';
import { NodeComponent } from '../node/node.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  row = 20;
  column = (window.screen.width / NodeComponent.nodeSize)-1;
  startPoint: Point = {x: 0, y: 2};
  endPoint: Point = {x: 0, y: 5};
  isWall: boolean[][] = [];
  bfs: Algorithm = Algorithm.BFS;
  dfs: Algorithm = Algorithm.DFS;

  clearMessage = new Subject<void>();

  constructor(public alg: AlgorithmService) { }

  ngOnInit(): void {
    this.resetWall();
  }

  resetWall(){
    this.isWall = [];
    for(let i = 0; i<this.column; i++){
      this.isWall.push(Array(this.row).fill(false));
    }
  }

  clear(){
    this.resetWall();
    this.clearMessage.next();
  }
}
