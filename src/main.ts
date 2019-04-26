import { CompositeDisposable } from 'atom';
import { HoverProvidersRegistry } from './atom-ide-hover';
import { MarkdownService } from './atom-ide-markdown-service';
import { DatatipHoverProviderInstance } from './DatatipHoverProvider';
import { DatatipServiceInstance } from './DatatipService';

class Main {
  private _subscriptions = new CompositeDisposable();

  activate(): void {
  }

  deactivate(): void {
    this._subscriptions.dispose();
  }

  ProvideDatatipService() {
    console.log('ProvideDatatipService');

    return DatatipServiceInstance;
  }

  ConsumeHoverProvidersRegistry(hoverProvidersRegistry: HoverProvidersRegistry) {
    console.log('ConsumeHoverProvidersRegistry');

    hoverProvidersRegistry.AddProvider(DatatipHoverProviderInstance);
  }

  ConsumeMarkdownRenderer(service: MarkdownService) {
    console.log('ConsumeMarkdownRenderer');

    DatatipHoverProviderInstance.MarkdownService = service;
  }
}

module.exports = new Main();
