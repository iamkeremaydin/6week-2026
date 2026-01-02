import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup prevents DOM pollution between tests
afterEach(() => {
  cleanup();
});

