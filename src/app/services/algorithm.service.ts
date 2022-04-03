import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Point } from '../Point';

class Queue<T> {
  private elements: T[];
  private head: number;
  private tail: number;

  constructor() {
    this.elements = [];
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element: T) {
    this.elements[this.tail] = element;
    this.tail++;
  }

  dequeue(): T {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }

  peek(): T {
    return this.elements[this.head];
  }

  getLength(): number {
    return this.tail - this.head;
  }

  isEmpty(): boolean {
    return this.getLength() === 0;
  }
}

let dx: number[] = [1, 0, -1, 0];
let dy: number[] = [0, 1, 0, -1];

export enum Algorithm{
  DFS,
  BFS
}

enum Orientation{
  HORIZONTAL, VERTICAL
}

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  visitedSubject: Subject<Point[]> = new Subject<Point[]>();
  visited: Point[] = [];
  wallSubject: Subject<Point[]> = new Subject<Point[]>();

  constructor() { }

  callPathfindingAlgorithm(startPoint: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][], algorith: Algorithm){
    this.visited = [];
    if(algorith === Algorithm.BFS){
      this.bfs(startPoint, endPoint, rows, cols, wall);
    }
    else if(algorith === Algorithm.DFS){
      this.dfs(startPoint, endPoint, rows, cols, wall);
    }
    this.visitedSubject.next(this.visited);
  }

  private bfs(startPoint: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][]){
    let q: Queue<Point> = new Queue<Point>();
    q.enqueue(startPoint);
    while(!q.isEmpty()){
      let tmp: Point = q.dequeue();
      if(this.checkForDuplicate(tmp)){
        continue;
      }
      this.visited.push(tmp);
      if(tmp.x === endPoint.x && tmp.y === endPoint.y){
        break;
      }
      for(let i = 0; i<4; i++){
        let newPoint: Point = {x: tmp.x + dx[i],y: tmp.y + dy[i], beforePoint: tmp};
        if(this.checkIfOutOfBoundary(newPoint, rows, cols, wall)){
          continue;
        }
        q.enqueue(newPoint);
      }
    }
  }

  private checkIfOutOfBoundary(newPoint: Point, rows: number, cols: number, wall: boolean[][]): boolean{
    return (newPoint.x < 0 || newPoint.x >= cols || newPoint.y < 0 || newPoint.y >= rows || wall[newPoint.x][newPoint.y]);
  }

  private checkForDuplicate(toCheck: Point): Point | undefined{
    return this.visited.find((point: Point) => point.x === toCheck.x && point.y === toCheck.y)
  }

  private dfs(point: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][]): boolean{
    if(this.checkForDuplicate(point)){
      return false;
    }
    this.visited.push(point);
    if(point.x === endPoint.x && point.y === endPoint.y){
      return true;
    }
    for(let i = 0; i<4; i++){
      let newPoint: Point = {x: point.x + dx[i],y: point.y + dy[i], beforePoint: point};
      if(this.checkIfOutOfBoundary(newPoint, rows, cols, wall)){
        continue;
      }
      let found = this.dfs(newPoint, endPoint, rows, cols, wall);
      if(found){
        return true;
      }
    }
    return false;
  }

  getPath(visited: Point[], endPoint: Point): Point[] | undefined{
    if(visited[visited.length-1].x != endPoint.x || visited[visited.length-1].y != endPoint.y) return undefined;
    let path: Point[] = [];
    let tmp: Point | undefined = visited[visited.length-1];
    while(tmp){
      path.push(tmp);
      tmp = tmp.beforePoint;
    }
    return path.reverse();
  }

  getVisited(): Observable<Point[]>{
    return this.visitedSubject.asObservable();
  }

  //return int between [0, max-1]
  private getRandomInt(max: number): number{
    return Math.floor(Math.random()*max);
  }

  checkForCollisionWithStartOrEndPoint(x: number, y: number, startPoint: Point, endPoint: Point){
    if(x == startPoint.x && y == startPoint.y || x == endPoint.x && y == endPoint.y) return true;
    return false;
  }

  callMazeAlgorithm(width: number, height: number, startPoint: Point, endPoint: Point){
    let wall: Point[] = [];

    for(let i = 0; i<width; i++){
      if(this.checkForCollisionWithStartOrEndPoint(i, 0, startPoint, endPoint)) continue;
      wall.push({x:i, y:0});
    }

    for(let i = 0; i<height; i++){
      if(this.checkForCollisionWithStartOrEndPoint(0, i, startPoint, endPoint)) continue;
      wall.push({x: 0, y: i});
      if(this.checkForCollisionWithStartOrEndPoint(width-1, i, startPoint, endPoint)) continue;
      wall.push({x: width-1, y: i});
    }

    for(let i = 0; i<width; i++){
      if(this.checkForCollisionWithStartOrEndPoint(i, height-1, startPoint, endPoint)) continue;
      wall.push({x: i, y: height-1});
    }
    
    this.recursiveDivision(wall, 1, 1, width-2, height-2, this.chooseOrientation(width-2, height-2), startPoint, endPoint, new Array<Point>(), true);
    this.wallSubject.next(wall);
  }

  checkIfWallCollidesWithPassage(passages: Point[], wx: number, wy: number, orientation: Orientation, length: number): boolean{
    let minValueForCollision = ((orientation === Orientation.HORIZONTAL)? wx : wy)-1;
    let maxValueForCollision = ((orientation === Orientation.HORIZONTAL)? wx+length : wy+length)+1;

    let possibleCollisionIndexWithRespectToTmp = -1;
    let possibleCollisionIndexWithRespectToPassages = -1;
    while(true){
      let tmp = passages.slice(possibleCollisionIndexWithRespectToPassages+1);
      possibleCollisionIndexWithRespectToTmp = tmp.findIndex((point: Point) => {
        return (orientation === Orientation.HORIZONTAL)? point.y == wy : point.x == wx;
      });
      if(tmp.length == 0 || possibleCollisionIndexWithRespectToTmp == -1) break;
      
      let previousCollisionIndex = possibleCollisionIndexWithRespectToPassages;
      possibleCollisionIndexWithRespectToPassages = possibleCollisionIndexWithRespectToTmp + previousCollisionIndex + 1
      let furtherCheck = (orientation === Orientation.HORIZONTAL)? passages[possibleCollisionIndexWithRespectToPassages].x : passages[possibleCollisionIndexWithRespectToPassages].y;
      if(minValueForCollision <= furtherCheck && furtherCheck <= maxValueForCollision) return true;
    }
    return false;
  }

  private recursiveDivision(wall: Point[], x: number, y: number, width: number, height: number, orientation: Orientation, startPoint: Point, endPoint: Point, passages: Point[], tryNewOrientation: boolean){
    if(width < 2 || height < 2) return;
    if(width == 2 && orientation === Orientation.VERTICAL || height == 2 && orientation === Orientation.HORIZONTAL) return;

    let lengthOfWall = (orientation === Orientation.HORIZONTAL)? width : height;
    
    //where will the wall be drawn from
    let numberOfIteration = 10000;
    do{
      if(numberOfIteration == 0){
        if(tryNewOrientation) {this.recursiveDivision(wall, x, y, width, height, (orientation === Orientation.HORIZONTAL)? Orientation.VERTICAL : Orientation.HORIZONTAL, startPoint, endPoint, passages, false);}
        return;
      }
      var wx = x + ((orientation === Orientation.HORIZONTAL)? 0 : this.getRandomInt(width-2)+1);
      var wy = y + ((orientation === Orientation.HORIZONTAL)? this.getRandomInt(height-2)+1: 0);
      numberOfIteration--;
    }while(this.checkIfWallCollidesWithPassage(passages, wx, wy, orientation, lengthOfWall));

    var px = wx + ((orientation === Orientation.HORIZONTAL)? this.getRandomInt(width) : 0);
    var py = wy + ((orientation === Orientation.HORIZONTAL)? 0 : this.getRandomInt(height));
    passages.push({x: px, y: py});

    let dx = (orientation === Orientation.HORIZONTAL)? 1 : 0;
    let dy = (orientation === Orientation.HORIZONTAL)? 0 : 1;

    
    for(let i = 0; i<lengthOfWall; i++){
      if(!(wx == px && wy == py || this.checkForCollisionWithStartOrEndPoint(wx, wy, startPoint, endPoint))){
        wall.push({x: wx, y: wy});
      }
      wx += dx;
      wy += dy;
    }

    let newX = x;
    let newY = y;
    let newWidth = (orientation === Orientation.HORIZONTAL) ? width : wx-x;
    let newHeight = (orientation === Orientation.HORIZONTAL) ? wy-y : height;
    this.recursiveDivision(wall, newX, newY, newWidth, newHeight, this.chooseOrientation(newWidth, newHeight), startPoint, endPoint, passages, true);
    
    newX = (orientation === Orientation.HORIZONTAL)? x : wx+1;
    newY = (orientation === Orientation.HORIZONTAL)? wy+1 : y;
    newWidth = (orientation === Orientation.HORIZONTAL)? width : width-(wx-x+1);
    newHeight = (orientation === Orientation.HORIZONTAL)? height-(wy-y+1) : height;
    this.recursiveDivision(wall, newX, newY, newWidth, newHeight, this.chooseOrientation(newWidth, newHeight), startPoint, endPoint, passages, true);
  }

  private chooseOrientation(width: number, height: number): Orientation{
    if(width < height) return Orientation.HORIZONTAL;
    else if(height < width) return Orientation.VERTICAL;

    return (this.getRandomInt(2) == 0) ? Orientation.HORIZONTAL : Orientation.VERTICAL;
  }

  getWall(){
    return this.wallSubject;
  }
}
