package com.rohan.taskmanager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rohan.taskmanager.entity.Task;
import com.rohan.taskmanager.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository repository;

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task saveTask(Task task) {
        return repository.save(task);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }

    public Task completeTask(Long id) {

    Task task = repository.findById(id).orElse(null);

    if(task != null) {
        task.setStatus("Completed");
        return repository.save(task);
    }

    return null;
}

    public Task updateTask(Long id, Task updatedTask) {

    Task task = repository.findById(id).orElse(null);

    if(task != null) {
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());

        return repository.save(task);
    }

    return null;
}

    public List<Task> searchTasks(String title){
    return repository.findByTitleContainingIgnoreCase(title);
}

    public List<Task> getTasksByStatus(String status){
    return repository.findByStatus(status);
}
    }

