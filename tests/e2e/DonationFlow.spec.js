import { test, expect } from '@playwright/test';

test.describe('Fluxo Crítico de Doação', () => {
  test('Simulando o usuário: login, visualização da ONG, clique em doar, e finalização', async ({ page }) => {
    // 1. Mock API Responses
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
          id: 1,
          full_name: 'Doador E2E',
          email: 'doador@teste.com',
          role: 'donor',
        }),
      });
    });

    await page.route('**/api/v1/ngos/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'ong-1', name: 'ONG Teste E2E', score: 95, causeLabel: 'Meio Ambiente' }
        ]),
      });
    });

    await page.route('**/api/v1/ngos/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'ong-1', name: 'ONG Teste E2E', score: 95, causeLabel: 'Meio Ambiente' }
        ]),
      });
    });

    await page.route('**/api/v1/ngos/ong-1/campaigns/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/bundles/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/campaigns/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/api/v1/financial/payment-methods/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'pix-1', method_type: 'pix', is_active: true }]),
      });
    });

    await page.route('**/api/v1/financial/donations/', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'donation-123', amount: 50, status: 'pending' }),
      });
    });

    await page.route('**/api/v1/financial/donations/*/process/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'completed' }),
      });
    });

    // 2. Navegar para o Login
    await page.goto('/login');
    
    // Preencher formulário de login
    await page.fill('input[type="email"]', 'doador@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button:has-text("Entrar")');

    // 3. Aguardar redirecionamento
    await expect(page).toHaveURL(/\/donor-profile/);
    await page.click('text=Doar Agora');

    // Agora estamos na tela de causas
    await expect(page).toHaveURL(/\/causas/);
    
    // Clicar no botão Ver Mais da ONG mockada
    await page.click('text=Ver Mais');

    // 4. Estamos no Perfil da ONG
    await expect(page.locator('h1', { hasText: 'ONG Teste E2E' })).toBeVisible();
    await page.click('button:has-text("Completar Doação")');

    // 5. Fluxo de Doação na DonationPage
    await expect(page).toHaveURL(/\/doacao/);
    
    // Selecionar valor
    await page.click('button:has-text("R$ 50")');

    // Confirmar que método de pagamento PIX existe e está selecionado (é o default)
    await expect(page.locator('button', { hasText: 'PIX' }).first()).toBeVisible();

    // Finalizar Doação
    await page.click('button:has-text("Finalizar Doação")');

    // 5. Verificar tela de Sucesso
    await expect(page.locator('h2', { hasText: 'Obrigado por seu apoio!' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Resumo da Doação')).toBeVisible();
    await expect(page.locator('text=R$ 50,00')).toBeVisible();
  });
});
