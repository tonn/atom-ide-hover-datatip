import { TextEditor, Point } from 'atom';

export interface HoverProvider {
  Get$(textEditor: TextEditor, position: Point, mouseEvent: MouseEvent): Promise<(HTMLElement | String)[]>;
}

export interface HoverProvidersRegistry {
  AddProvider(provider: HoverProvider): void;

  readonly Providers: ReadonlyArray<HoverProvider>;
}
