/**
 * Test de configuración básica
 * Este test verifica que Jest esté configurado correctamente
 */

describe('Jest Setup', () => {
  it('should be configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should have access to jest matchers', () => {
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    document.body.appendChild(element);
    
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');
  });

  it('should have localStorage mock', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    localStorage.clear();
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve('done');
    await expect(promise).resolves.toBe('done');
  });
});