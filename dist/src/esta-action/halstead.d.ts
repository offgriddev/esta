import ts from 'typescript';
import type { HalsteadMetrics } from './types';
export declare function calculateHalstead(filePath: string, target: ts.ScriptTarget): Promise<Record<string, HalsteadMetrics>>;
