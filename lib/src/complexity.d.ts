import ts from 'typescript';
export declare function calculateFromSource(source: ts.SourceFile): Record<string, unknown>;
export declare function calculateComplexity(filePath: string, scriptTarget: ts.ScriptTarget): Promise<Record<string, number>>;
