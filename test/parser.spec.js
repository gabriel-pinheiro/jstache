const Lab = require('@hapi/lab');
const Code = require('@hapi/code');

const { parser } = require('../dist/parser');

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('parser', () => {
    it('should parse text', () => {
        const text = 'Hello World!';
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'TEXT',
            value: 'Hello World!'
        }]);
    });

    it('should parse code', () => {
        const text = '{{some code}}';
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'CODE',
            value: 'some code',
        }]);
    });

    it('should ignore comments', () => {
        const text = 'foo{{! this is a comment }}bar';
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'TEXT',
            value: 'foo',
        }, {
            type: 'COMMENT',
            value: ' this is a comment ',
        }, {
            type: 'TEXT',
            value: 'bar',
        }]);
    });

    it('should combine text, code and comments', () => {
        const text = [
            '{{! greetings to them }}',
            'Hello {{name}}!'
        ].join('');
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'COMMENT',
            value: ' greetings to them ',
        }, {
            type: 'TEXT',
            value: 'Hello ',
        }, {
            type: 'CODE',
            value: 'name',
        }, {
            type: 'TEXT',
            value: '!',
        }]);
    });

    it('should give friendly error for invalid templates', () => {
        const text = [
            'Here is a template that starts valid',
            'But suddenly we open a tag and {{never close',
        ].join('');
        expect(() => parser.parse(text)).to.throw(/line 1.*column 81.*expected "}}"/i);
    });

    it('should escape close mustaches', () => {
        const text = '{{foo.bar("\\}}");}}'
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'CODE',
            value: 'foo.bar("}}");',
        }]);
    });

    it('should escape open mustaches', () => {
        const text = "hello \\{{ world";
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'TEXT',
            value: 'hello {{ world',
        }]);
    });

    it('should escape backslashes', () => {
        const text = '\\\\{{code}}';
        const result = parser.parse(text);
        expect(result).to.equal([{
            type: 'TEXT',
            value: '\\',
        }, {
            type: 'CODE',
            value: 'code',
        }]);
    });
});
