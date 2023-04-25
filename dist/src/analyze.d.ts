import ts from 'typescript';
export declare function analyze(sha: string, actor: string, workingDirectory: string, scriptTarget: ts.ScriptTarget): Promise<string>;
