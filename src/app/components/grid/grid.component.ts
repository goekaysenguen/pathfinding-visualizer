import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AlgorithmService, Algorithm } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';
import { Observable, retry } from 'rxjs';

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
  @Output() startPointChange = new EventEmitter<Point>();
  @Input() endPoint!: Point;
  @Output() endPointChange = new EventEmitter<Point>();

  @Input() clear!: Observable<void>;

  runVisualization: boolean = true;
  runAlgorithm = false;

  makeWall: boolean = false;
  deleteWall: boolean = false;
  mooveStart: boolean = false;
  mooveEnd: boolean = false;

  @Output() callAlgorihtm = new EventEmitter<void>();

  constructor(private alg: AlgorithmService) { }

  ngOnInit(): void {
    this.numbersRow = Array(this.row).fill(1).map((x, i) => {return i});
    this.numbersColumn = Array(this.column).fill(1).map((x, i) => {return i});
    this.resetVisitedAndPath();
    this.alg.getVisited().subscribe((visited: Point[]) => {this.update(visited)});
    this.clear.subscribe(() => {this.resetVisitedAndPath(); this.runVisualization = true; this.runAlgorithm = false});
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
    this.resetVisitedAndPath();
    if(this.runVisualization){
      for(let i = 0; i<visited.length; i++){
        setTimeout(() => {this.isVisited[visited[i].x][visited[i].y] = true;}, i*10);
      }
      let path = this.alg.getPath(visited);
      for(let i = 0; i<path.length; i++){
        setTimeout(() => {this.isPath[path[i].x][path[i].y] = true;}, (visited.length+i)*10);
      }
      setTimeout(() => {this.runVisualization = false}, (visited.length+path.length)*10);
    }
    else{
      for(let i = 0; i<visited.length; i++){
        this.isVisited[visited[i].x][visited[i].y] = true;
      }
      let path = this.alg.getPath(visited);
      for(let i = 0; i<path.length; i++){
        this.isPath[path[i].x][path[i].y] = true;
      }
    }
    this.runAlgorithm = true;
  }

  isStartPoint(x: number, y: number){
    return this.startPoint.x === x && this.startPoint.y === y;
  }

  isEndPoint(x: number, y: number){
    return this.endPoint.x === x && this.endPoint.y === y;
  }

  handleMouseDown(x: number, y: number){
    if(this.runAlgorithm && this.runVisualization){
      return;
    }
    if(this.isStartPoint(x, y)){
      this.mooveStart = true;
    }
    else if(this.isEndPoint(x, y)){
      this.mooveEnd = true;
    }
    else if(!this.isWall[x][y]){
      this.makeWall = true;
      this.addWall(x, y);
    }
    else{
      this.deleteWall = true;
      this.removeWall(x, y);
    }
  }

  handleMouseUp(x: number, y: number){
    this.mooveStart = false;
    this.mooveEnd = false;
    this.makeWall = false;
    this.deleteWall = false;
  }

  handleMouseOver(x: number, y: number){
    if(this.mooveStart){
      this.startPoint = {x: x, y: y};
      this.startPointChange.emit(this.startPoint);
      if(this.runAlgorithm){
        this.callAlgorihtm.emit();
      }
    }
    else if(this.mooveEnd){
      this.endPoint = {x: x, y: y};
      this.endPointChange.emit(this.endPoint);
      if(this.runAlgorithm){
        this.callAlgorihtm.emit();
      }
    }
    else if(this.makeWall){
      this.addWall(x, y);
    }
    else if(this.deleteWall){
      this.removeWall(x, y);
    }
  }

  addWall(x: number, y: number){
    this.isWall[x][y] = true;
    this.isWallChange.emit(this.isWall);
  }

  removeWall(x: number, y: number){
    this.isWall[x][y] = false;
    this.isWallChange.emit(this.isWall);
  }
}
