import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'
import { GameMockClient, Game } from "../../shared";

const NAME_KEBAB = "app-home";
@Component({
	templateUrl: "./home.component.html",
	styleUrls: ["./home.scss"],
	host: { class: NAME_KEBAB },
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeComponent implements OnInit {
	gamesData$!: Observable<Game[]>
	lastPlayed: any = []
	inputSerach: any = []
	itemId: any = [];
	constructor(private gameMockClient: GameMockClient) { }

	ngOnInit() {
		this.fetchData();
		this.gamesData$.subscribe(data => {
			this.inputSerach = data;
			localStorage.getItem("lastplayed")?.split(",").forEach((d) => {
				this.inputSerach.filter((f: any) => {
					if (f.id === d) {
						this.lastPlayed.push(f);
					}
				})
			})
		});
	}

	fetchData() {
		this.gamesData$ = this.gameMockClient.getAll$().pipe(
			map(data => data.filter(game => game.tag === "trending"))
		);
	}

	// LAST PLAYED
	getLastPlayed(item: any) {
		this.inputSerach.filter((f: any) => {
			if (f.id === item.id) {
				this.lastPlayed.push(item);
				this.lastPlayed = [...new Set(this.lastPlayed)].reverse();
				this.itemId = this.lastPlayed.map((m: any) => m.id).slice(0, 5);
				localStorage.setItem("lastplayed", this.itemId.join());
			}
		})
	}
}