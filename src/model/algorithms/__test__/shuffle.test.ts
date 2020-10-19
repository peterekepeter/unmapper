import { shuffle } from "../shuffle";

test('empty returns empty', () => expect(shuffle([])).toEqual([]));

test('single element returns same', () => expect(shuffle([1])).toEqual([1]));

test('shuffle changes list', () => expect(shuffle([1,2,3,4,5,6,7,8])).not.toEqual([1,2,3,4,5,6,7,8]));

test('result should be a list', () => expect(shuffle([1,2,3]).forEach).toBeDefined());