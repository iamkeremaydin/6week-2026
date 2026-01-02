import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clean up after each test to avoid memory leaks
afterEach(() => {
  cleanup();
});

