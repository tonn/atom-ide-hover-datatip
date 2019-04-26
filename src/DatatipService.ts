import { Disposable, TextEditor } from 'atom';
import { DatatipService, DatatipProvider } from 'atom-ide';

class DatatipServiceImpl implements DatatipService {
  private _datatipProviders: DatatipProvider[] = [];

  addProvider(provider: DatatipProvider): Disposable {
    const index = this._datatipProviders.findIndex(
      p => provider.priority > p.priority,
    );

    if (index === -1) {
      this._datatipProviders.push(provider);
    } else {
      this._datatipProviders.splice(index, 0, provider);
    }

    return new Disposable(() => this.removeProvider(provider));
  }

  removeProvider(provider: DatatipProvider): void {
    const index = this._datatipProviders.indexOf(provider);

    if (index !== -1) {
      this._datatipProviders.splice(index, 1);
    }
  }

  GetProviderForEditor(editor: TextEditor) {
    const grammar = editor.getGrammar().scopeName;
    return this.FindProvider(grammar);
  }

  FindProvider(grammar: string): DatatipProvider | null {
    for (const provider of this.FindAllProviders(grammar)) {
      return provider;
    }

    return null;
  }

  *FindAllProviders(grammar: string): IterableIterator<DatatipProvider> {
    for (const provider of this._datatipProviders) {
      if (provider.grammarScopes == null ||
          provider.grammarScopes.indexOf(grammar) !== -1) {
        yield provider;
      }
    }
  }
}

export const DatatipServiceInstance = new DatatipServiceImpl();
