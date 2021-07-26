import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AppPagesRoutingModule } from "./pages-routing.module";

import { HomeComponent } from "./home/home.component";
import { SidebarComponent } from './sidebar/sidebar.component';
import { GamesComponent } from './games/games.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


const COMPONENTS = [
	HomeComponent,
	SidebarComponent,
	GamesComponent,
];

@NgModule({
	imports: [
		CommonModule,
		AppPagesRoutingModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		...COMPONENTS,
	],
	exports: [
		...COMPONENTS
	]
})
export class AppPagesModule {

}
