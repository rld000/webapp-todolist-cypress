describe('TODO app tests', () => {
  beforeEach(() => {
      cy.visit('index.html');
  });

  it('should add a new task', () => {
      cy.get('#taskInput').type('new task');
      cy.get('#addTaskBtn').click();
      cy.get('.task-item span').should('contain', 'new task');
  });

  it('should edit and save an existing task', () => {
      cy.get('#taskInput').type('task to edit');
      cy.get('#addTaskBtn').click();
      cy.get('.task-item button').contains('Edytuj').click();
      cy.get('.task-item input[type="text"]').clear().type('edited task');
      cy.get('.task-item button').contains('Zapisz').click();
      cy.get('.task-item span').should('contain', 'edited task');
  });

  it('should remove a task', () => {
      cy.get('#taskInput').type('task to remove');
      cy.get('#addTaskBtn').click();
      cy.get('.task-item button').contains('Usuń').click();
      cy.get('.task-item').should('not.exist');
  });

  it('should save tasks in localStorage and load them after refresh', () => {
      cy.get('#taskInput').type('task to save');
      cy.get('#addTaskBtn').click();
      cy.reload();
      cy.get('.task-item span').should('contain', 'task to save');
  });

  it('should check the checkbox interaction', () => {
      cy.get('#taskInput').type('task to check');
      cy.get('#addTaskBtn').click();
      cy.get('.task-item input[type="checkbox"]').check();
      cy.get('.task-item span').should('have.class', 'completed');
  });

  it('should filter tasks based on selection', () => {
    cy.get('#taskInput').type('undone task');
    cy.get('#addTaskBtn').click();
    cy.get('#taskInput').type('done task');
    cy.get('#addTaskBtn').click();
    cy.get('.task-item input[type="checkbox"]').first().check();
    cy.get('#filterSelect').select('done');
    cy.get('.task-item span')
      .should('contain', 'done task')
      .and('have.class', 'completed');
  });

  it('should simulate delay when adding a task', () => {
    cy.clock();
    cy.get('#taskInput').type('task with delay');
    cy.get('#addTaskBtn').click();
    
    cy.tick(1000); 

    cy.get('.task-item span').should('contain', 'task with delay');
    cy.clock().invoke('restore');
  });


  it('should test responsiveness of the app', () => {
      cy.viewport('iphone-6');
      cy.get('#taskInput').type('task');
      cy.get('#addTaskBtn').click();
      cy.get('.task-item span').should('contain', 'task');
  });

  it('should handle asynchronous tasks properly', () => {
      cy.get('#taskInput').type('async task');
      cy.get('#addTaskBtn').click();
      cy.get('.task-item').then((items) => {
          expect(items.length).to.be.greaterThan(0);
      });
  });
});
