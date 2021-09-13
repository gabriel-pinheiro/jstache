import * as vm from 'vm';
import { parser, Node } from "./parser";

export function compile(code: string) {
    const ast = parser.parse(code);

    return (context: object): string => {
        return ast
            .map(n => evaluate(n, context))
            .join('');
    };
}

function evaluate(node: Node, context: object): string {
    switch (node.type) {
        case 'COMMENT': return '';
           case 'TEXT': return node.value;
           case 'CODE': return runCode(node.value, context);
    }
}

function runCode(code: string, context: object): string {
    vm.createContext(context);
    return vm.runInContext(code, context);
}
