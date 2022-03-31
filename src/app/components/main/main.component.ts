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
  startPoint: Point = {x: Math.floor(this.column/4), y: Math.floor(this.row/2)};
  endPoint: Point = {x: Math.floor(this.column*3/4), y: Math.floor(this.row/2)};
  wall: boolean[][] = [];

  showAlgorithmView = false;

  clearMessage = new Subject<void>();

  chosenAlgorithm = Algorithm.DFS;

  constructor(private alg: AlgorithmService) { }

  ngOnInit(): void {
    this.resetWall();
  }

  resetWall(){
    this.wall = [];
    for(let i = 0; i<this.column; i++){
      this.wall.push(Array(this.row).fill(false));
    }
  }

  clear(){
    this.resetWall();
    this.clearMessage.next();
  }

  toggleAlgorthmsView(){
    this.showAlgorithmView = !this.showAlgorithmView;
  }

  callAlgorithm(){
    this.alg.callPathfindingAlgorithm(this.startPoint, this.endPoint, this.row, this.column, this.wall, this.chosenAlgorithm);
  }

  chooseAlgorithmAndHideView(alg: number){
    switch(alg){
      case 0: 
        this.chosenAlgorithm = Algorithm.DFS;
        break;
      case 1: 
        this.chosenAlgorithm = Algorithm.BFS;
        break;
    }
    this.showAlgorithmView = false;
  }

  callMaze(){
    this.alg.callMazeAlgorithm(this.column, this.row, this.startPoint, this.endPoint);
  }
}
