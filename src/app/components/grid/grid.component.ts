import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  row: number = 30;
  column: number = 30;
  numbersRow: number[] = Array(this.row).fill(1).map((x, i) => {return i});
  numbersColumn: number[] = Array(this.column).fill(1).map((x, i) => {return i});
  visited: Point[] = [];
  startPoint: Point = {x: 0, y: 2};
  endPoint: Point = {x: 0, y: 5};
  isVisited: boolean[][] = [];

  constructor(public alg: AlgorithmService) { }

  ngOnInit(): void {
    for(let i = 0; i<this.column; i++){
      this.isVisited.push(Array(this.row).fill(false));
    }
    this.alg.getVisited().subscribe((visited: Point[]) => {this.visited = visited});
  }

  callBfs(){
    this.alg.bfs(this.startPoint, this.endPoint, this.row, this.column);
    for(let i = 0; i<this.visited.length; i++){
      setTimeout(() => {this.isVisited[this.visited[i].x][this.visited[i].y] = true;}, i*50);
    }
  }

  isStartPoint(x: number, y: number){
    return this.startPoint.x === x && this.startPoint.y === y;
  }

  isEndPoint(x: number, y: number){
    return this.endPoint.x === x && this.endPoint.y === y;
  }
}
