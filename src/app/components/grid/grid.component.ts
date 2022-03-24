import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';

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
  @Input() startPoint!: Point;
  @Input() endPoint!: Point;
  @Output() wallEvent = new EventEmitter<boolean[][]>();
  isVisited: boolean[][] = [];
  isWall: boolean[][] = [];
  isPath: boolean[][] = [];

  constructor(public alg: AlgorithmService) { }

  ngOnInit(): void {
    this.numbersRow = Array(this.row).fill(1).map((x, i) => {return i});
    this.numbersColumn = Array(this.column).fill(1).map((x, i) => {return i});
    for(let i = 0; i<this.column; i++){
      this.isVisited.push(Array(this.row).fill(false));
      this.isWall.push(Array(this.row).fill(false));
      this.isPath.push(Array(this.row).fill(false));
    }
    this.alg.getVisited().subscribe((visited: Point[]) => {this.update(visited)});
  }

  update(visited: Point[]){
    for(let i = 0; i<visited.length; i++){
      setTimeout(() => {this.isVisited[visited[i].x][visited[i].y] = true;}, i*10);
    }
    let path = this.alg.getPath(visited);
    for(let i = 0; i<path.length; i++){
      setTimeout(() => {this.isPath[path[i].x][path[i].y] = true;}, (visited.length+i)*10);
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
