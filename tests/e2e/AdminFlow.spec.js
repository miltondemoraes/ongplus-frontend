import { test, expect } from '@playwright/test';

test.describe('Fluxo Administrativo (AdminDashboard)', () => {
  test('Simulando administrador: login, carregamento do dashboard e transição de abas', async ({ page }) => {
    // 1. Mock API Responses for Auth
    await page.route('**/api/v1/auth/login/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access: 'fake-jwt-token', refresh: 'fake-refresh' }),
      });
    });

    await page.route('**/api/v1/auth/me/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          full_name: 'Super Admin',
          email: 'admin@ongplus.org',
          role: 'admin',
        }),
      });
    });

    // 2. Mock API Responses for Admin Dashboard Data
    await page.route('**/api/v1/admin/review/ngos/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'ong-1', name: 'ONG Pendente E2E', cnpj: '11.111.111/0001-11', verificationStatus: 'pending', score: 50 }
        ]),
      });
    });

    await page.route('**/api/v1/admin/review/campaigns/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/admin/ngos/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'ong-1', name: 'ONG Pendente E2E', score: 50, verificationStatus: 'pending' },
          { id: 'ong-2', name: 'ONG Verificada E2E', score: 100, verificationStatus: 'verified' }
        ]),
      });
    });

    await page.route('**/api/v1/admin/campaigns/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/admin/bundles/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/admin/score-criteria/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { key: 'test', label: 'Teste', description: 'Teste de score', weight: 10 }
        ]),
      });
    });

    // 3. Navigate to Login
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@ongplus.org');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Entrar")');

    // 4. Verify Redirect to Admin Dashboard
    await expect(page).toHaveURL(/\/admin-dashboard/);
    
    // Verify Dashboard Rendered with Admin User Data
    await expect(page.locator('h1', { hasText: 'Gestão ONG+' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Super Admin' })).toBeVisible();
    
    // Verify default tab content (Revisão)
    await expect(page.locator('h2', { hasText: 'ONGs em revisão' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'ONG Pendente E2E' })).toBeVisible();

    // 5. Navigate to ONGs tab
    await page.click('button:has-text("ONGs")');
    await expect(page.locator('h2', { hasText: 'Todas as ONGs' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'ONG Verificada E2E' })).toBeVisible();

    // 6. Navigate to Campanhas tab
    await page.click('button:has-text("Campanhas")');
    await expect(page.locator('h2', { hasText: 'Todas as campanhas' })).toBeVisible();

    // 7. Navigate to Bundles tab
    await page.click('button:has-text("Bundles")');
    await expect(page.locator('h2', { hasText: 'Nova campanha coletiva' })).toBeVisible();
  });
});
