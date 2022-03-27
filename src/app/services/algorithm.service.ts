import { Inject, Injectable } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
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

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  visitedSubject: Subject<Point[]> = new Subject<Point[]>();
  visited: Point[] = [];

  constructor() { }

  callAlgorithm(startPoint: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][], algorith: Algorithm){
    this.visited = [];
    if(algorith === Algorithm.BFS){
      this.bfs(startPoint, endPoint, rows, cols, wall);
    }
    else if(algorith === Algorithm.DFS){
      this.dfs(startPoint, endPoint, rows, cols, wall);
    }
    this.visitedSubject.next(this.visited);
  }

  bfs(startPoint: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][]){
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

  checkIfOutOfBoundary(newPoint: Point, rows: number, cols: number, wall: boolean[][]): boolean{
    return (newPoint.x < 0 || newPoint.x >= cols || newPoint.y < 0 || newPoint.y >= rows || wall[newPoint.x][newPoint.y]);
  }

  checkForDuplicate(toCheck: Point): Point | undefined{
    return this.visited.find((point: Point) => point.x === toCheck.x && point.y === toCheck.y)
  }

  dfs(point: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][]): boolean{
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
}
