export interface Renderable {
  render(): string;
  shouldBeLazy(): boolean;
}
