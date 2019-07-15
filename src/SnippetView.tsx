import etch from 'etch';

import { EtchComponentBase } from './EtchComponentBase';

export interface SnippetViewProperties {
  GrammarName: string;
  Snippet: string;
}

export class SnippetView extends EtchComponentBase<SnippetViewProperties> {
  render(): JSX.Element {
    const { GrammarName, Snippet } = this.properties;

    return (
      <pre>
        <code className={GrammarName}>
          {Snippet}
        </code>
      </pre>
    );
  }
}
