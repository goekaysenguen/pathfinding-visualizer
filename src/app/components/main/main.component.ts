import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from 'src/app/services/algorithm.service';
import { Point } from 'src/app/Point';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  row: number = 30;
  column: number = 30;
  startPoint: Point = {x: 0, y: 2};
  endPoint: Point = {x: 20, y: 5};

  constructor(public alg: AlgorithmService) { }

  ngOnInit(): void {
  }
}
