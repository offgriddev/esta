import ts from 'typescript';
import { OperationMetrics } from './types';
export declare const isIdentifier: (kind: ts.SyntaxKind) => boolean;
export declare const isLiteral: (kind: ts.SyntaxKind) => boolean;
export declare const isToken: (kind: ts.SyntaxKind) => boolean;
export declare const isKeyword: (kind: ts.SyntaxKind) => boolean;
export declare const isAnOperator: (node: ts.Node) => boolean;
export declare const isAnOperand: (node: ts.Node) => boolean;
export declare const getOperatorsAndOperands: (node: ts.Node) => OperationMetrics;
export declare function isFunctionWithBody(node: ts.Node): boolean;
export declare function getName(node: ts.NamedDeclaration): string;