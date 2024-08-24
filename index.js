const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const program = new Command();

const TODO_FILE = 'todos.json';

function readTodos() {
  if (!fs.existsSync(TODO_FILE)) {
    return [];
  }
  const data = fs.readFileSync(TODO_FILE, 'utf8');
  return JSON.parse(data);
}


function writeTodos(todos) {
  fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2));
}

program
  .name('todo')
  .description('CLI to manage todos')
  .version('1.0.0');

program.command('add')
  .description('Add a new todo')
  .argument('<task>', 'Task description')
  .action((task) => {
    const todos = readTodos();
    todos.push({ id: Date.now(), task, done: false });
    writeTodos(todos);
    console.log('Todo added successfully!');
  });

program.command('list')
  .description('List all todos')
  .action(() => {
    const todos = readTodos();
    if (todos.length === 0) {
      console.log('No todos found.');
    } else {
      todos.forEach(todo => {
        console.log(`${todo.id}: [${todo.done ? 'X' : ' '}] ${todo.task}`);
      });
    }
  });

program.command('delete')
  .description('Delete a todo')
  .argument('<id>', 'Todo ID')
  .action((id) => {
    let todos = readTodos();
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== parseInt(id));
    if (todos.length === initialLength) {
      console.log('Todo not found.');
    } else {
      writeTodos(todos);
      console.log('Todo deleted successfully!');
    }
  });

program.command('done')
  .description('Mark a todo as done')
  .argument('<id>', 'Todo ID')
  .action((id) => {
    const todos = readTodos();
    const todo = todos.find(todo => todo.id === parseInt(id));
    if (todo) {
      todo.done = true;
      writeTodos(todos);
      console.log('Todo marked as done!');
    } else {
      console.log('Todo not found.');
    }
  });

program.parse();