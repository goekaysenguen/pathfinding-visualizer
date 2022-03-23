import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  @Input() row!: number;
  @Input() column!: number;
  numbersRow: number[] = [];
  numbersColumn: number[] = [];
  visited: Point[] = [];
  @Input() startPoint!: Point;
  @Input() endPoint!: Point;
  @Output() wallEvent = new EventEmitter<boolean[][]>();
  isVisited: boolean[][] = [];
  isWall: boolean[][] = [];

  constructor(public alg: AlgorithmService) { }

  ngOnInit(): void {
    this.numbersRow = Array(this.row).fill(1).map((x, i) => {return i});
    this.numbersColumn = Array(this.column).fill(1).map((x, i) => {return i});
    for(let i = 0; i<this.column; i++){
      this.isVisited.push(Array(this.row).fill(false));
      this.isWall.push(Array(this.row).fill(false));
    }
    this.alg.getVisited().subscribe((visited: Point[]) => {this.update(visited)});
  }

  update(visited: Point[]){
    this.visited = visited;
    for(let i = 0; i<this.visited.length; i++){
      setTimeout(() => {this.isVisited[this.visited[i].x][this.visited[i].y] = true;}, i*10);
    }
  }

  isStartPoint(x: number, y: number){
    return this.startPoint.x === x && this.startPoint.y === y;
  }

  isEndPoint(x: number, y: number){
    return this.endPoint.x === x && this.endPoint.y === y;
  }

  toggleWall(x: number, y: number){
    this.isWall[x][y] = !this.isWall[x][y];
    this.wallEvent.emit(this.isWall);
  }
}
