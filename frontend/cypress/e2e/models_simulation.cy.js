describe('Models and Simulation Flow', function () {
    beforeEach(function () {
        // 1. Автентифікація
        cy.visit('/auth');
        // Використовуємо селектори з Auth.tsx
        cy.get('input[placeholder="Username"]').type('testing');
        cy.get('input[placeholder="Password"]').type('Hello12345#');
        cy.contains('button', 'Login').click();
        // Даємо більше часу на обробку входу та перенаправлення
        cy.wait(2000);
        // Переконуємося, що ми перейшли на сторінку моделей
        cy.url().should('include', '/models');
    });
    // Допоміжна функція для запуску симуляції та перевірки результату
    var runSimulationAndVerifyResult = function (modelName, steps, params, initial, expectedH3Title, visualizationModes) {
        // Переконуємося, що ми знаходимося в режимі Create Simulation
        cy.contains('button', 'Create Simulation').click();
        // 1. Вибираємо модель
        cy.get('#model').select(modelName);
        // 2. Вводимо кроки
        cy.get('#steps').clear().type(steps);
        // 3. Вводимо параметри
        Object.keys(params).forEach(function (key) {
            cy.get("#".concat(key)).clear().type(params[key]);
        });
        // 4. Вводимо початкові умови
        cy.get('#initial').clear().type(initial);
        // 5. Запускаємо симуляцію
        cy.contains('button', 'Run Simulation').click();
        // 6. Перевіряємо результат
        // Шукаємо заголовок h3
        cy.contains('h3', expectedH3Title).should('exist');
        // Перевіряємо наявність кнопки повернення до історії
        cy.contains('button', 'Back to History').should('exist');
        // 7. Перевіряємо всі режими візуалізації
        visualizationModes.forEach(function (mode) {
            // Шукаємо кнопку за текстом всередині колонки інформації
            cy.get('.info-column').contains('button', mode).click();
            // Перевіряємо, що контейнер графіка існує та активний
            cy.get('.plot-wrapper', { timeout: 20000 }).should('exist');
            // Перевіряємо, що кнопка активна
            cy.get('.info-column').contains('button', mode).should('have.class', 'active');
        });
    };
    it('should display the Models page title and navigate to History', function () {
        // Перевіряємо, що ми знаходимося в режимі Create Simulation 
        cy.contains('h2', 'Create New Simulation').should('exist');
        // Перевіряємо навігацію до History
        cy.contains('button', 'History').click();
        // Перевіряємо, що контент переключився на SimulationHistory
        cy.contains('h2', 'Simulation History', { timeout: 10000 }).should('exist');
        // Повертаємося до Create Simulation
        cy.contains('button', 'Create Simulation').click();
        cy.contains('h2', 'Create New Simulation').should('exist');
    });
    it('should successfully run a Henon Map simulation and check 2D plots', function () {
        runSimulationAndVerifyResult('Henon Map', '1000', { a: '1.4', b: '0.3' }, '0.1, 0.3', 'Henon Map Simulation', ['X-Y', 'X-T', 'Y-T']);
    });
    it('should successfully run a Lorenz Attractor simulation and check 2D/3D plots', function () {
        runSimulationAndVerifyResult('Lorenz Attractor', '1000', { sigma: '10', rho: '28', beta: '2.6666666666666665', dt: '0.01' }, '1, 1, 1', 'Lorenz Attractor Simulation', ['X-Y', 'X-T', 'Y-T', 'Z-T', '3D']);
    });
    it('should successfully run a Thomas Attractor simulation and check 2D/3D plots', function () {
        runSimulationAndVerifyResult('Thomas Attractor', '1000', { b: '0.18', dt: '0.01' }, '0, 0, 1', 'Thomas Attractor Simulation', ['X-Y', 'X-T', 'Y-T', 'Z-T', '3D']);
    });
    it('should display created simulations in history and allow viewing details', function () {
        // Припускаємо, що попередні тести успішно створили 3 симуляції.
        // Переходимо до історії
        cy.contains('button', 'History').click();
        cy.contains('h2', 'Simulation History', { timeout: 20000 }).should('exist');
        // Перевіряємо, що в історії є щонайменше 3 елементи 
        // Припускаємо, що кожен елемент історії має клас .history-item
        cy.get('.history-item').should('have.length.at.least', 3);
        // Знаходимо останню створену симуляцію (Thomas Attractor) і клікаємо на неї
        // Припускаємо, що елементи історії містять назву моделі
        cy.contains('.history-item', 'THOMAS').first().click();
        // Перевіряємо, що ми перейшли до деталей симуляції
        cy.contains('h3', 'Thomas Attractor Simulation').should('exist');
        cy.contains('button', 'Back to History').click();
        // Перевіряємо, що ми повернулися до історії
        cy.contains('h2', 'Simulation History', { timeout: 20000 }).should('exist');
    });
});
