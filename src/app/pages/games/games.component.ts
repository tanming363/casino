import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, fromEvent } from "rxjs";
import { GameMockClient, Game } from "../../shared";
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
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

  @ViewChild("myInputSerach", { static: true }) myInputSerach!: ElementRef;
  @ViewChild("myDropDownSearch", { static: true }) myDropDownSearch!: ElementRef;

  constructor(
    private gameMockClient: GameMockClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.gamesData$ = this.gameMockClient.getAll$();
    this.gamesData$.subscribe(data => {
      this.inputSerach = data;
      localStorage.getItem("lastplayed")?.split(",").forEach((d) => {
        this.inputSerach.filter((f: Game) => {
          if (f.id === d) {
            this.lastPlayed.push(f);
          }
        })
      })
      this.dropDownSearch = Array.from(new Set(data.map(d => d.providerName))).map(pro => {
        return data.find(d => d.providerName === pro)
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
        this.gamesData$?.subscribe(data => {
          this.inputSerach = data.filter(f => f.title.toLowerCase().includes(res.toLowerCase()));
          if (this.inputSerach.length === 0) {
            this.alertMsg = true
            this.gameNameNotAval = res;
          } else {
            this.alertMsg = false
          }
        })
      })
  }

  // QUERY PARAMS
  onOptionsSelected() {
    this.router.navigate(['/games'], {
      queryParams: {
        search: this.myInputSerach.nativeElement.value,
        provider: this.myDropDownSearch.nativeElement.value
      }
    });
  }

  // DROPDOWN FILTER BY PROVIDER
  dropdownFilter() {
    const gameProviderName = fromEvent<any>(this.myDropDownSearch.nativeElement, 'change');
    gameProviderName
      .pipe(
        map(event => event.target.value),
      )
      .subscribe(res => {
        this.gamesData$?.subscribe(data => {
          if (res !== "allProvider") {
            this.inputSerach = data.filter(f => f.providerName.toLowerCase() === res.toLowerCase());
          } else {
            this.inputSerach = data.map(data => data);
          }
        })
      })
  }

  // LAST PLAYED
  getLastPlayed(item: Game) {
    this.inputSerach.filter((f: Game) => {
      if (f.id === item.id) {
        this.lastPlayed.push(item);
        this.lastPlayed = [...new Set(this.lastPlayed)].reverse();
        this.itemId = this.lastPlayed.map((m: Game) => m.id).slice(0, 5);
        localStorage.setItem("lastplayed", this.itemId.join());
      }
    })
  }
}