export interface Thumb {
	url: string;
	title: string;
}
export interface Game {
	id: string;
	slug: string;
	title: string;
	tag: string;
	providerName: string;
	startUrl: string;
	thumb: Thumb;
}