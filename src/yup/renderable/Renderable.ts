type RenderResult = {
  isLazy: boolean;
  rendered: string;
};

export interface Renderable {
  render(): RenderResult;
}
