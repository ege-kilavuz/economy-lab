import { describe, it, expect } from 'vitest';
import { clamp, tl } from './math';

describe('clamp', () => {
  it('should return value within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('should clamp to min', () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  it('should clamp to max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('should handle edge values', () => {
    expect(clamp(0, 0, 100)).toBe(0);
    expect(clamp(100, 0, 100)).toBe(100);
  });
});

describe('tl', () => {
  it('should round to nearest integer', () => {
    expect(tl(10.4)).toBe(10);
    expect(tl(10.5)).toBe(11);
    expect(tl(10.6)).toBe(11);
  });

  it('should handle negative numbers', () => {
    expect(tl(-10.4)).toBe(-10);
    expect(tl(-10.6)).toBe(-11);
  });

  it('should handle zero', () => {
    expect(tl(0)).toBe(0);
  });
});
