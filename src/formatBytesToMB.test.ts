import { assertEquals } from 'https://deno.land/std@0.141.0/testing/asserts.ts';
import { formatBytesToMB } from './formatBytesToMB.ts';

Deno.test('formatBytesToMB', () => {
  assertEquals(formatBytesToMB(12345689), '11.77');
});
