import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GamesComponent } from "./games/games.component";
import { HomeComponent } from "./home/home.component";

const ROUTES: Routes = [
	{ path: "", component: GamesComponent },
	{ path: "home", component: HomeComponent },
	{ path: "games", component: GamesComponent },
	{ path: "games/:id", component: GamesComponent },
	{ path: "**", component: GamesComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(ROUTES, {
		// enableTracing: true
	})],
	exports: [RouterModule],
})
export class AppPagesRoutingModule {

}
