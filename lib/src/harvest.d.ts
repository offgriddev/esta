import ts from 'typescript';
import { HalsteadMetrics } from './types';
type ComplexityResult = {
    source: string;
    metrics: Record<string, HalsteadMetrics & {
        complexity: number;
    }>;
};
export declare function analyzeTypeScript(sourceFiles: string[], scriptTarget: ts.ScriptTarget): Promise<ComplexityResult[]>;
export {};
