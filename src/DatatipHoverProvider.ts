import { TextEditor, Point } from 'atom';

import { HoverProvider } from './atom-ide-hover';
import { MarkdownService } from './atom-ide-markdown-service';

import { DatatipServiceInstance } from './DatatipService';

class DatatipHoverProvider implements HoverProvider {
  private _markdownService: MarkdownService | undefined;

  set MarkdownService(service: MarkdownService) {
    this._markdownService = service;
  }

  async Get$(textEditor: TextEditor, position: Point): Promise<(HTMLElement | String)[]> {
    try {
      if (!this._markdownService) {
        throw Error('atom-ide-markdown-service not found');
      }

      const provider = DatatipServiceInstance.GetProviderForEditor(textEditor);

      if (provider) {
        const datatip = await provider.datatip(textEditor, position, null);

        if (datatip) {
          const grammar = textEditor.getGrammar().name.toLowerCase();

          return Promise.all(datatip.markedStrings
            .filter(markedString => markedString.value.length > 0)
            .map(async markedString => {
            if (markedString.type === 'markdown') {
              return await this.getDocumentationHtml$(markedString.value, grammar);
            } else if (markedString.type === 'snippet') {
              return await this.getSnippetHtml$(markedString.value, grammar);
            }

            return '';
          }));
        }
      }
    } catch (err) {
      console.error(err); // TODO: move catch to UI-level
    }

    return [];
  }

  private async getSnippetHtml$(snippet: string, grammarName: string): Promise<string> {
    if (!this._markdownService) {
      throw Error('atom-ide-markdown-service not found');
    }

    if ((snippet !== undefined) && (snippet.length > 0)) {
      const regExpLSPPrefix = /^\((method|property|parameter|alias)\)\W/;
      const preElem = document.createElement('pre');
      const codeElem = document.createElement('code');

      codeElem.classList.add(grammarName);
      codeElem.innerText = snippet.replace(regExpLSPPrefix, '');
      preElem.appendChild(codeElem);

      return this._markdownService.render(preElem.outerHTML, grammarName);
    }

    return '';
  }

  private async getDocumentationHtml$(markdownText: string, grammarName: string): Promise<string> {
    if (!this._markdownService) {
      throw Error('atom-ide-markdown-service not found');
    }

    return this._markdownService.render(markdownText, grammarName);
  }
}

export const DatatipHoverProviderInstance = new DatatipHoverProvider();
