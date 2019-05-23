import { ScaleScore } from './scale-score';

/**
 * True if the scale score is scored.
 *
 * @param value The scale score to test
 */
export function isScored(value: ScaleScore): boolean {
  // Claim scores may not have values or standard error depending on the subject assessment definition
  // so it is only safe to use the level
  return value != null && value.level != null;
}
