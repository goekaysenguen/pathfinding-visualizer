import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit {
  @Input() row!: number;
  @Input() column!: number;
  numbersRow: number[] = [];
  numbersColumn: number[] = [];

  isVisited: boolean[][] = []
  isPath: boolean[][] = [];
  @Input() isWall: boolean[][] = [];
  @Output() isWallChange: EventEmitter<boolean[][]> = new EventEmitter();

  @Input() startPoint!: Point;
  @Input() endPoint!: Point;

  @Input() clear!: Observable<void>;



  constructor(private alg: AlgorithmService) { }

  ngOnInit(): void {
    this.numbersRow = Array(this.row).fill(1).map((x, i) => {return i});
    this.numbersColumn = Array(this.column).fill(1).map((x, i) => {return i});
    this.resetVisitedAndPath();
    this.alg.getVisited().subscribe((visited: Point[]) => {this.update(visited)});
    this.clear.subscribe(() => {this.resetVisitedAndPath()});
  }

  resetVisitedAndPath(){
    this.isVisited = [];
    this.isPath = [];
    for(let i = 0; i<this.column; i++){
      this.isVisited.push(Array(this.row).fill(false));
      this.isPath.push(Array(this.row).fill(false));
    }
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
    this.isWall[x][y] = true;
    this.isWallChange.emit(this.isWall);
  }
}
