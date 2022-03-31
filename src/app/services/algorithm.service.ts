import { SafeKeyedRead } from '@angular/compiler';
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

  getPath(visited: Point[]): Point[]{
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

  callMazeAlgorithm(width: number, height: number, startPoint: Point, endPoint: Point){
    let wall: Point[] = [];
    for(let i = 0; i<width; i++){
      wall.push({x:i, y:0});
    }
    for(let i = 0; i<height; i++){
      wall.push({x: 0, y: i});
      wall.push({x: width-1, y: i});
    }
    for(let i = 0; i<width; i++){
      wall.push({x: i, y: height-1});
    }
    this.recursiveDivision(wall, 1, 1, width-2, height-2, this.chooseOrientation(width-2, height-2), startPoint, endPoint, 7);
    this.wallSubject.next(wall);
  }

  private recursiveDivision(wall: Point[], x: number, y: number, width: number, height: number, orientation: Orientation, startPoint: Point, endPoint: Point, depth: number){
    if(width < 2 || height< 2) return;

    //where will the wall be drawn from
    let wx = x + ((orientation === Orientation.HORIZONTAL) ? 0 : this.getRandomInt(width-2)+1);
    let wy = y + ((orientation === Orientation.HORIZONTAL) ? this.getRandomInt(height-2)+1 : 0);

    //where will the passage through the wall be
    let px = wx + ((orientation === Orientation.HORIZONTAL) ? this.getRandomInt(width) : 0);
    let py = wy + ((orientation === Orientation.HORIZONTAL) ? 0 : this.getRandomInt(height));

    let dx = (orientation === Orientation.HORIZONTAL) ? 1 : 0;
    let dy = (orientation === Orientation.HORIZONTAL) ? 0 : 1;

    let length = (orientation === Orientation.HORIZONTAL) ? width : height;
    for(let i = 0; i<length; i++){
      if(!(wx == px && wy == py || wx == startPoint.x && wy == startPoint.y || wx == endPoint.x && wy == endPoint.y)){
        wall.push({x: wx, y: wy});
      }
      wx += dx;
      wy += dy;
    }


    let newX = x;
    let newY = y;
    let newWidth = (orientation === Orientation.HORIZONTAL) ? width : wx-x;
    let newHeight = (orientation === Orientation.HORIZONTAL) ? wy-y : height;
    //console.log(newX + " " + newY + " " + newWidth + " " + newHeight);
    this.recursiveDivision(wall, newX, newY, newWidth, newHeight, this.chooseOrientation(newWidth, newHeight), startPoint, endPoint, depth-1);

    newX = (orientation === Orientation.HORIZONTAL) ? x : wx+1;
    newY = (orientation === Orientation.HORIZONTAL) ? wy+1 : y;
    newWidth = (orientation === Orientation.HORIZONTAL) ? width : width-wx;
    newHeight = (orientation === Orientation.HORIZONTAL) ? height-wy : height;
    //console.log(newX + " " + newY + " " + newWidth + " " + newHeight);
    this.recursiveDivision(wall, newX, newY, newWidth, newHeight, this.chooseOrientation(newWidth, newHeight), startPoint, endPoint, depth-1);
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
