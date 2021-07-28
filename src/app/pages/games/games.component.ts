import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, fromEvent } from "rxjs";
import { GameMockClient, Game } from "../../shared";
import { debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, AfterViewInit {
  gamesData$!: Observable<Game[]>;
  inputSerach: Game[] = [];
  dropDownSearch: any[] = [];
  alertMsg: boolean = false;
  gameNameNotAval: any;
  lastPlayed: Game[] = []
  itemId: any = [];
  allData: Game[] = []

  @ViewChild("myInputSerach", { static: true }) myInputSerach!: ElementRef;
  @ViewChild("myDropDownSearch", { static: true }) myDropDownSearch!: ElementRef;


  constructor(
    private gameMockClient: GameMockClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.gamesData$ = this.gameMockClient.getAll$().pipe(shareReplay());
    this.gamesData$.subscribe(res => {
      this.allData = res;
      this.inputSerach = res;
      localStorage.getItem("lastplayed")?.split(",").forEach((item) => {
        this.allData.filter((f: Game) => {
          if (f.id === item) {
            this.lastPlayed.push(f);
          }
        })
      })
      this.dropDownSearch = Array.from(new Set(res.map(m => m.providerName))).map(pro => {
        return res.find(d => d.providerName === pro)
      })
    });
  }

  ngAfterViewInit() {
    this.dropdownFilter();
    this.searchFiter();
  }

  // SEARCH FILTER
  searchFiter() {
    const searchTerm = fromEvent<any>(this.myInputSerach.nativeElement, 'keyup');
    searchTerm
      .pipe(
        map(event => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(res => {
        if (this.myDropDownSearch.nativeElement.value === "allProvider") {
          this.inputSerach = this.allData.filter((f: Game) => f.title.toLowerCase().includes(res.toLowerCase()));
          this.alertMsgFun(res);
        } else {
          this.inputSerach = this.allData.filter((f: Game) => f.title.toLowerCase().includes(res.toLowerCase()) && f.providerName === this.myDropDownSearch.nativeElement.value);
          this.alertMsgFun(res);
        }
      })
  }

  // DROPDOWN FILTER BY PROVIDER
  dropdownFilter() {
    const gameProviderName = fromEvent<any>(this.myDropDownSearch.nativeElement, 'change');
    gameProviderName
      .pipe(
        map(event => event.target.value),
      )
      .subscribe(res => {
        if (this.myInputSerach.nativeElement.value === "") {
          if (res !== "allProvider") {
            this.inputSerach = this.allData.filter((f: Game) => f.providerName.toLowerCase() === res.toLowerCase());
          } else {
            this.inputSerach = this.allData.map((data: Game) => data);
          }
        } else {
          if (res !== "allProvider") {
            this.inputSerach = this.allData.filter((f: Game) => f.title.toLowerCase().includes(this.myInputSerach.nativeElement.value.toLowerCase()) && f.providerName === this.myDropDownSearch.nativeElement.value);
          } else {
            this.inputSerach = this.allData.filter((f: Game) => f.title.toLowerCase().includes(this.myInputSerach.nativeElement.value.toLowerCase()));
          }
        }
      })
  }


  // LAST PLAYED
  getLastPlayed(item: Game) {
    this.allData.filter((f: Game) => {
      if (f.id === item.id) {
        this.lastPlayed.push(item);
        this.lastPlayed = [...new Set(this.lastPlayed)].reverse();
        this.itemId = this.lastPlayed.map((m: Game) => m.id).slice(0, 5);
        localStorage.setItem("lastplayed", this.itemId.join());
      }
    })
  }

  // ALERT MSG FUNCTION
  alertMsgFun(res: any) {
    if (this.inputSerach.length === 0) {
      this.alertMsg = true
      this.gameNameNotAval = res;
    } else {
      this.alertMsg = false
    }
  }
}