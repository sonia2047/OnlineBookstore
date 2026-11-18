import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Vitest does not enable globals by default, so React Testing Library's
// automatic cleanup is not registered. Unmount rendered trees after each test.
afterEach(() => {
  cleanup();
});
