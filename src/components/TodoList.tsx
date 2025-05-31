
import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addTodo();
    }
  };

  return (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          Focus Tasks
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Add new todo */}
        <div className="flex gap-2">
          <Textarea
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a focus task..."
            className="resize-none"
            rows={2}
          />
          <Button onClick={addTodo} size="icon" className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Todo list */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No tasks yet. Add one to get started!
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  todo.completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 w-6 h-6 mt-0.5"
                  onClick={() => toggleTodo(todo.id)}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                </Button>
                <span
                  className={`flex-1 text-sm ${
                    todo.completed
                      ? 'line-through text-gray-500'
                      : 'text-gray-900'
                  }`}
                >
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 w-6 h-6 text-red-500 hover:text-red-700"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            {todos.filter(t => t.completed).length} of {todos.length} tasks completed
          </div>
        )}
      </div>
    </div>
  );
};
