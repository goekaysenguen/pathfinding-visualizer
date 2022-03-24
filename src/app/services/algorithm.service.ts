import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class AlgorithmService {
  visited: Subject<Point[]> = new Subject<Point[]>();
  constructor() { }

  bfs(startPoint: Point, endPoint: Point, rows: number, cols: number, wall: boolean[][]){
    let q: Queue<Point> = new Queue<Point>();
    let visited: Point[] = [];
    q.enqueue(startPoint);
    while(!q.isEmpty()){
      let tmp: Point = q.dequeue();
      if(visited.find((point: Point) => point.x === tmp.x && point.y === tmp.y)){
        continue;
      }
      visited.push(tmp);
      if(tmp.x === endPoint.x && tmp.y === endPoint.y){
        break;
      }
      for(let i = 0; i<4; i++){
        let newPoint: Point = {x: tmp.x + dx[i],y: tmp.y + dy[i], beforePoint: tmp};
        if(newPoint.x < 0 || newPoint.x >= cols || newPoint.y < 0 || newPoint.y >= rows || wall[newPoint.x][newPoint.y]){
          continue;
        }
        q.enqueue(newPoint);
      }
    }
    this.visited.next(visited);
  }

  getPath(visited: Point[]): Point[]{
    let path: Point[] = [];
    let tmp: Point | undefined = visited[visited.length-1];
    while(tmp){
      path.push(tmp);
      tmp = tmp.beforePoint;
    }
    return path.reverse();
  }

  getVisited(): Subject<Point[]>{
    return this.visited;
  }

}
