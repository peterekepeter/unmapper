import { format_angle, format_int, format_float, format_padded_float } from "./format-numeric"


export class Exporter {

    indentation = 0;

    get length() {
        return this._length
    }

    write(str: string): Exporter {
        if (this._startOfLine) {
            this._writeIndentation()
            this._startOfLine = false
        }
        this._writeBuffer(str)
        return this
    }

    newline(): Exporter {
        this._writeBuffer('\n')
        this._startOfLine = true
        return this
    }

    increaseIndent(): Exporter {
        this.indentation++
        return this
    }

    decraseIndent(): Exporter {
        this.indentation--
        return this
    }

    toString(): string {
        return this._buffer.join('')
    }

    writeAngle(degrees: number): Exporter {
        this.write(format_angle(degrees))
        return this
    }

    writeInt(int: number): Exporter {
        this.write(format_int(int))
        return this
    }

    writeFloat(float: number): Exporter {
        this.write(format_float(float))
        return this
    }

    writePaddedFloat(float: number): Exporter {
        this.write(format_padded_float(float))
        return this
    }

    writeBoolean(bool: boolean): Exporter {
        this.write(bool ? 'True' : 'False')
        return this
    }

    writeString(str: string): Exporter{
        return str.indexOf(' ') !== -1
            ? this.write('"').write(str).write('"')
            : this.write(str)
    }

    private _buffer: string[] = [];
    private _length = 0;
    private _indentationLevel = 0;
    private _indentationString = '';
    private _startOfLine = true;

    private _writeBuffer(s: string) {
        this._buffer.push(s)
        this._length += s.length
    }

    private _writeIndentation() {
        if (this.indentation != this._indentationLevel) {
            this._indentationLevel = this.indentation
            this._indentationString = this._indentationToString(this._indentationLevel)
        }
        this._writeBuffer(this._indentationString)
    }

    private _indentationToString(level: number): string {
        switch (level) {
            case 0: return ''
            case 1: return '    '
            case 2: return '       '
            case 3: return '          '
            case 4: return '             '
            case 5: return '                '
            default:
                if (level < 0) {
                    return ''
                }
                let i = ' '
                while (level > 0) {
                    i += '   '
                    level--
                }
                return i
        }
    }
}